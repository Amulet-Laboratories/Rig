import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'

interface SitemapUrl {
  loc: string
  priority: number
  changefreq: string
  lastmod?: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'

  const articles: any[] = await queryCollection(event, 'articles').all()
  const pages: any[] = await queryCollection(event, 'pages').all()

  const comparisonUrls = getComparisonUrls()

  // Site-specific values -- override via NUXT_CONTENT_PERSONA_SLUGS and
  // NUXT_CONTENT_CATEGORY_SLUGS env vars (comma-separated), or keep defaults.
  const personaSlugs = ((config.contentPersonaSlugs as string) || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)

  const freePages = ((config.contentFreePages as string) || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)

  const categorySlugs = ((config.contentCategorySlugs as string) || '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)

  const urls: SitemapUrl[] = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    ...pages.map((page) => ({
      loc: page.path,
      priority: 0.7,
      changefreq: 'monthly',
    })),
    ...articles.map((article) => ({
      loc: article.path,
      priority: 0.8,
      changefreq: 'weekly',
      lastmod: article.updatedAt || article.publishedAt,
    })),
    { loc: '/compare', priority: 0.7, changefreq: 'weekly' },
    ...comparisonUrls.map((loc) => ({
      loc,
      priority: 0.6,
      changefreq: 'monthly' as const,
    })),
    ...personaSlugs.map((slug) => ({
      loc: `/best-for/${slug}`,
      priority: 0.6,
      changefreq: 'monthly' as const,
    })),
    ...freePages.map((slug) => ({
      loc: `/free/${slug}`,
      priority: 0.5,
      changefreq: 'monthly' as const,
    })),
    ...categorySlugs.map((slug) => ({
      loc: `/category/${slug}`,
      priority: 0.7,
      changefreq: 'weekly' as const,
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteUrl}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return sitemap
})

function getComparisonUrls(): string[] {
  const config = useRuntimeConfig()
  const comparisonNiches = ((config.contentComparisonNiches as string) || 'coffee')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean)

  const dataDir = resolve(process.cwd(), 'data/products')
  const products: Array<{ slug: string; category: string }> = []

  for (const niche of comparisonNiches) {
    const nicheDir = join(dataDir, niche)
    if (!existsSync(nicheDir)) continue
    const files = readdirSync(nicheDir).filter((f) => f.endsWith('.yaml'))
    for (const file of files) {
      try {
        const content = readFileSync(join(nicheDir, file), 'utf-8')
        const product = parse(content) as Record<string, unknown>
        if (product.slug && product.category) {
          products.push({ slug: product.slug as string, category: product.category as string })
        }
      } catch {
        // Skip malformed files
      }
    }
  }

  const urls: string[] = []
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      if (products[i].category === products[j].category) {
        urls.push(`/compare/${products[i].slug}-vs-${products[j].slug}`)
      }
    }
  }
  return urls.slice(0, 50)
}
