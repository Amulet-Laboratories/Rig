import { readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'
import { injectAffiliateTag } from '../../utils/injectAffiliateTag'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Product slug required' })
  }

  const dataDir = resolve(process.cwd(), 'data/products')
  const niches = ['skincare', 'home', 'boardgames', 'pets', 'coffee', 'books']

  for (const niche of niches) {
    const filePath = join(dataDir, niche, `${slug}.yaml`)
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8')
      const product = parse(content) as Record<string, unknown>
      return injectAffiliateTag(product)
    }
  }

  throw createError({ statusCode: 404, statusMessage: `Product not found: ${slug}` })
})
