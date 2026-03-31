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
  schema?: string
  rating?: number
  price?: string
  faq?: Array<{ question: string; answer: string }>
}

export const useStructuredData = (page: StructuredDataPage) => {
  const { name: siteName, url: siteUrl } = useSiteConfig()
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

  let schemaType = 'Article'

  switch (page.schema) {
    case 'Review':
      schemaType = 'Review'
      baseData.itemReviewed = {
        '@type': 'Product',
        name: page.title,
      }
      if (page.rating) {
        baseData.reviewRating = {
          '@type': 'Rating',
          ratingValue: page.rating,
          bestRating: 5,
        }
      }
      break
    case 'HowTo':
      schemaType = 'HowTo'
      baseData.name = page.title
      break
    default:
      schemaType = 'Article'
  }

  baseData['@type'] = schemaType

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
