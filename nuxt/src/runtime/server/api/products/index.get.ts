import { defineEventHandler } from 'h3'
import { readAllProducts } from '../../utils/products'
import { injectAffiliateTag } from '../../utils/injectAffiliateTag'

export default defineEventHandler(async () => {
  const products = await readAllProducts()
  return products.map((product) => injectAffiliateTag(product))
})
