import { readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from 'yaml'
import { defineEventHandler, getRouterParam, createError } from 'h3'
import { injectAffiliateTag } from '../../utils/injectAffiliateTag'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Product slug required' })
  }

  const dataDir = resolve(process.cwd(), 'data/products')
  const niches = [
    'skincare',
    'home',
    'boardgames',
    'pets',
    'coffee',
    'books',
    'fashion',
    'fitness',
    'food',
    'merch',
    'wellness',
  ]

  for (const niche of niches) {
    const filePath = join(dataDir, niche, `${slug}.yaml`)
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8')
      const product = parse(content)
      return injectAffiliateTag(product)
    }
  }

  throw createError({ statusCode: 404, statusMessage: `Product not found: ${slug}` })
})
