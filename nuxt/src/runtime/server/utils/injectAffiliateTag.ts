import { useRuntimeConfig } from 'nitropack/runtime'
import { applyAffiliateTag } from './applyAffiliateTag'

/**
 * Normalizes a product's Amazon affiliate tag for the current site, reading the
 * per-site tag from runtime config (NUXT_AMAZON_AFFILIATE_TAG). The actual
 * transform lives in {@link applyAffiliateTag}, which is Nuxt-free and unit
 * tested.
 */
export function injectAffiliateTag(product) {
  return applyAffiliateTag(product, useRuntimeConfig().amazonAffiliateTag || '')
}
