import { defineEventHandler, getRouterParam, createError } from 'h3'
import { readProduct } from '../../utils/products'
import { injectAffiliateTag } from '../../utils/injectAffiliateTag'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Product slug required' })
  }

  const product = await readProduct(slug)
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: `Product not found: ${slug}` })
  }

  return injectAffiliateTag(product)
})
