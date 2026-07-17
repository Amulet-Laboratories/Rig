import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'
import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'
import { queryCollection } from '@nuxt/content/nitro'

/**
 * Sitemap URL source for @nuxtjs/sitemap.
 *
 * The authority sites' content routes — /articles/**, /pages/** (about,
 * privacy…), /category/**, /best-for/**, /compare/**, /free/** — are ISR, so
 * they never enter the prerender manifest @nuxtjs/sitemap auto-discovers URLs
 * from. Left alone the generated sitemap.xml lists only the handful of static
 * page routes, hiding every article from search-engine discovery.
 *
 * A site opts in with a single line in nuxt.config:
 *   sitemap: { sources: ['/__sitemap__/rig-urls'] }
 * (It has to be per-site config rather than injected from the rig-nuxt module:
 * @nuxtjs/sitemap freezes `config.sources` at its own setup, which runs while
 * @nuxtjs/seo installs it — before rig-nuxt's setup — so a programmatic push
 * from here would arrive too late.)
 *
 * This route is registered via the module's content-gated addServerScanDir, so
 * content:false consumers (e.g. QuizSort) never mount it. The collection reads
 * are defensive anyway, so a content site missing a collection degrades to a
 * partial list rather than a 500 that would blank the whole sitemap.
 */

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

export default defineEventHandler(async (event): Promise<SitemapUrl[]> => {
  const config = useRuntimeConfig()

  let articles: Array<Record<string, unknown>> = []
  let pages: Array<Record<string, unknown>> = []
  try {
    // @ts-expect-error -- server queryCollection takes (event, collection)
    articles = await queryCollection(event, 'articles').all()
  } catch {
    articles = []
  }
  try {
    // @ts-expect-error -- server queryCollection takes (event, collection)
    pages = await queryCollection(event, 'pages').all()
  } catch {
    pages = []
  }

  const csv = (value: unknown): string[] =>
    String(value || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

  const personaSlugs = csv(config.contentPersonaSlugs)
  const freePages = csv(config.contentFreePages)
  const categorySlugs = csv(config.contentCategorySlugs)
  const comparisonUrls = getComparisonUrls()

  return [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    ...pages.map((page) => ({
      loc: page.path as string,
      priority: 0.7,
      changefreq: 'monthly',
    })),
    ...articles.map((article) => ({
      loc: article.path as string,
      priority: 0.8,
      changefreq: 'weekly',
      lastmod: (article.updatedAt || article.publishedAt) as string | undefined,
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
  ].filter((url) => url.loc)
})

function getComparisonUrls(): string[] {
  const config = useRuntimeConfig()
  const comparisonNiches = (config.contentComparisonNiches || 'coffee')
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
        const product = parse(content)
        if (product.slug && product.category) {
          products.push({ slug: product.slug, category: product.category })
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
