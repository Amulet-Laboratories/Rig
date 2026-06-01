import { useRuntimeConfig } from 'nitropack/runtime'

const PLACEHOLDER_TAG = 'YOURTAG-20'
let warnedMissingTag = false

/**
 * Replaces the placeholder affiliate tag in a product's Amazon URL with the
 * real per-site tag from runtime config (NUXT_AMAZON_AFFILIATE_TAG).
 *
 * When no tag is configured, the placeholder is STRIPPED rather than shipped:
 * a live URL containing `tag=YOURTAG-20` earns no commission and reads as
 * broken, so we emit a clean (un-attributed) Amazon link — and warn once in
 * dev — instead of leaking the placeholder to readers.
 */
export function injectAffiliateTag(product) {
  const amazonTag = useRuntimeConfig().amazonAffiliateTag || ''
  const url = product.amazon?.url

  if (!url || !url.includes(PLACEHOLDER_TAG)) return product

  const amazon = { ...product.amazon }

  if (amazonTag) {
    amazon.url = url.replace(PLACEHOLDER_TAG, amazonTag)
  } else {
    // No NUXT_AMAZON_AFFILIATE_TAG set — never expose the literal placeholder.
    try {
      const cleaned = new URL(url)
      cleaned.searchParams.delete('tag')
      amazon.url = cleaned.toString()
    } catch {
      amazon.url = url.replace(PLACEHOLDER_TAG, '')
    }
    if (!warnedMissingTag && process.env.NODE_ENV !== 'production') {
      warnedMissingTag = true
      // eslint-disable-next-line no-console
      console.warn(
        '[injectAffiliateTag] NUXT_AMAZON_AFFILIATE_TAG is not set — Amazon links render un-attributed (no commission). Set a per-site tag before production.',
      )
    }
  }

  return { ...product, amazon }
}
