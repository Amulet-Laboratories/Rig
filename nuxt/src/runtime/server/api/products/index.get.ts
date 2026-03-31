import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'
import { injectAffiliateTag } from '../../utils/injectAffiliateTag'

export default defineEventHandler(() => {
  const dataDir = resolve(process.cwd(), 'data/products')
  const niches = ['skincare', 'home', 'boardgames', 'pets', 'coffee', 'books']
  const products = []

  for (const niche of niches) {
    const nicheDir = join(dataDir, niche)
    if (!existsSync(nicheDir)) continue
    const files = readdirSync(nicheDir).filter((f) => f.endsWith('.yaml'))
    for (const file of files) {
      const content = readFileSync(join(nicheDir, file), 'utf-8')
      const product = parse(content)
      products.push(injectAffiliateTag(product))
    }
  }

  return products
})
