import { useRuntimeConfig, useRoute, useHead } from 'nuxt/app'

export interface StructuredDataProduct {
  slug: string
  name: string
  brand?: string
  image_url?: string
  rating?: number
  price_range?: string
  amazon?: { url?: string }
}

export interface StructuredDataPage {
  title: string
  description: string
  author?: string
  publishedAt?: string
  updatedAt?: string
  featuredImage?: {
    src: string
    alt: string
    width: number
    height: number
  }
  /** One of: 'Article' | 'HowTo' | 'Review' | 'ItemList' (auto-picked if products present). */
  schema?: string
  rating?: number
  price?: string
  faq?: Array<{ question: string; answer: string }>
  /**
   * Affiliate products referenced by the article. When passed, emits real
   * Product entities inside the appropriate parent schema (Review for a single
   * primary product, ItemList for roundups). Single biggest organic-CTR
   * multiplier for affiliate content — Google surfaces star ratings + prices
   * in the SERP when these are present.
   */
  products?: StructuredDataProduct[]
}

function productSchema(p: StructuredDataProduct, siteUrl: string) {
  const node: Record<string, unknown> = {
    '@type': 'Product',
    name: p.name,
  }
  if (p.brand) node.brand = { '@type': 'Brand', name: p.brand }
  if (p.image_url)
    node.image = p.image_url.startsWith('http') ? p.image_url : `${siteUrl}${p.image_url}`
  if (p.rating) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      bestRating: 5,
      ratingCount: 1,
    }
  }
  if (p.amazon?.url) {
    node.offers = {
      '@type': 'Offer',
      url: p.amazon.url,
      priceCurrency: 'USD',
      ...(p.price_range ? { price: extractMinPrice(p.price_range) } : {}),
      availability: 'https://schema.org/InStock',
    }
  }
  return node
}

function extractMinPrice(range: string): string | undefined {
  // "$169-$199" -> "169"
  const m = range.match(/\$?(\d+(?:\.\d+)?)/)
  return m ? m[1] : undefined
}

export const useStructuredData = (page: StructuredDataPage) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public?.siteUrl as string) || ''
  const siteName = (config.public?.siteName as string) || ''
  const route = useRoute()
  const url = `${siteUrl}${route.path}`

  const baseData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    headline: page.title,
    description: page.description,
    url: url,
    author: {
      '@type': 'Organization',
      name: page.author || siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  }

  if (page.featuredImage) {
    baseData.image = {
      '@type': 'ImageObject',
      url: `${siteUrl}${page.featuredImage.src}`,
      width: page.featuredImage.width,
      height: page.featuredImage.height,
    }
  }

  if (page.publishedAt) {
    baseData.datePublished = page.publishedAt
  }

  if (page.updatedAt) {
    baseData.dateModified = page.updatedAt
  }

  // Auto-pick schema: explicit > products-driven > Article default.
  // ≥2 products on an article without explicit schema → ItemList (roundup).
  // 1 product or explicit Review → Review.
  let schemaType = page.schema ?? 'Article'
  const productCount = page.products?.length ?? 0
  if (!page.schema && productCount >= 2) schemaType = 'ItemList'

  switch (schemaType) {
    case 'Review': {
      baseData['@type'] = 'Review'
      const primary = page.products?.[0]
      baseData.itemReviewed = primary
        ? productSchema(primary, siteUrl)
        : { '@type': 'Product', name: page.title }
      const rating = page.rating ?? primary?.rating
      if (rating) {
        baseData.reviewRating = {
          '@type': 'Rating',
          ratingValue: rating,
          bestRating: 5,
        }
      }
      break
    }
    case 'ItemList': {
      baseData['@type'] = 'ItemList'
      baseData.name = page.title
      baseData.numberOfItems = productCount
      baseData.itemListElement = (page.products ?? []).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: productSchema(p, siteUrl),
      }))
      break
    }
    case 'HowTo': {
      baseData['@type'] = 'HowTo'
      baseData.name = page.title
      break
    }
    default: {
      baseData['@type'] = 'Article'
    }
  }

  const scripts: Array<{ type: string; innerHTML: string }> = [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(baseData),
    },
  ]

  if (page.faq?.length) {
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }),
    })
  }

  useHead({ script: scripts })
}
