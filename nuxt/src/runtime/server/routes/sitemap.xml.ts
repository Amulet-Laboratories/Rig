import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'

  const articles = await queryCollection(event, 'articles').all()
  const pages = await queryCollection(event, 'pages').all()

  const comparisonUrls = getComparisonUrls()

  const personaSlugs = (config.contentPersonaSlugs || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const freePages = (config.contentFreePages || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const categorySlugs = (config.contentCategorySlugs || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const urls = [
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
      changefreq: 'monthly',
    })),
    ...personaSlugs.map((slug) => ({
      loc: `/best-for/${slug}`,
      priority: 0.6,
      changefreq: 'monthly',
    })),
    ...freePages.map((slug) => ({
      loc: `/free/${slug}`,
      priority: 0.5,
      changefreq: 'monthly',
    })),
    ...categorySlugs.map((slug) => ({
      loc: `/category/${slug}`,
      priority: 0.7,
      changefreq: 'weekly',
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

function getComparisonUrls() {
  const config = useRuntimeConfig()
  const comparisonNiches = (config.contentComparisonNiches || 'coffee')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const dataDir = resolve(process.cwd(), 'data/products')
  const products = []

  for (const niche of comparisonNiches) {
    const nicheDir = join(dataDir, niche)
    if (!existsSync(nicheDir)) continue
    const files = readdirSync(nicheDir).filter((f) => f.endsWith('.yaml'))
    for (const file of files) {
      try {
        const content = readFileSync(join(nicheDir, file), 'utf-8')
        const product = parse(content)
        if (product.slug && product.category) {
          products.push({ slug: product.slug, category: product.category })
        }
      } catch {
        // Skip malformed files
      }
    }
  }

  const urls = []
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      if (products[i].category === products[j].category) {
        urls.push(`/compare/${products[i].slug}-vs-${products[j].slug}`)
      }
    }
  }
  return urls.slice(0, 50)
}
