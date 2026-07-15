const PLACEHOLDER_TAG = 'YOURTAG-20'
let warnedMissingTag = false

/**
 * Pure transform behind {@link injectAffiliateTag}: applies `amazonTag` (the
 * per-site Associates tag, or '' when none is configured) to a product's
 * Amazon URL. Kept free of any Nuxt/nitropack import so it is directly unit
 * testable.
 *
 * - With a tag: the Amazon URL's `tag` query param is overwritten, so each
 *   property is attributed to its own account regardless of the tag baked into
 *   the source data (the product database ships the network's shared default).
 * - Without a tag: the data's baked-in tag is left intact (the shared default
 *   still earns) UNLESS it is the literal placeholder `YOURTAG-20`, which is
 *   stripped rather than shipped (and warned once in dev).
 *
 * Non-Amazon retailer URLs are never touched.
 *
 * NOTE: types are JSDoc, not annotations, and that is deliberate. Nitro does not
 * transpile this package's TypeScript when it is imported from node_modules —
 * Rollup parses these files as plain JavaScript and a bare `x: string` fails the
 * consumer's build with "Expected ',', got ':'". Every other runtime file here
 * is already annotation-free, which is why the convention held silently: `nuxt/`
 * is not in the root tsconfig `include`, so `pnpm typecheck` never checks it and
 * nothing enforces this. Keep runtime files JS-parseable.
 *
 * @param {{ amazon?: { url?: string } }} product
 * @param {string} amazonTag Per-site Associates tag, or '' when unconfigured.
 */
export function applyAffiliateTag(product, amazonTag) {
  const url = product.amazon?.url
  if (!url) return product

  /** @type {URL} */
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    // Non-URL string: only rescue the literal placeholder, never fabricate a tag.
    if (!url.includes(PLACEHOLDER_TAG)) return product
    const next = amazonTag
      ? url.replace(PLACEHOLDER_TAG, amazonTag)
      : url.replace(/([?&])tag=YOURTAG-20(&|$)/, (_m, pre, post) => (post === '&' ? pre : ''))
    return { ...product, amazon: { ...product.amazon, url: next } }
  }

  // Only rewrite Amazon storefront links; leave other retailers' URLs as-is.
  if (!/(^|\.)amazon\.[a-z.]+$/i.test(parsed.hostname)) return product

  const currentTag = parsed.searchParams.get('tag')

  if (amazonTag) {
    parsed.searchParams.set('tag', amazonTag)
  } else if (currentTag === PLACEHOLDER_TAG) {
    // No per-site tag configured — never expose the literal placeholder.
    parsed.searchParams.delete('tag')
    if (!warnedMissingTag && process.env.NODE_ENV !== 'production') {
      warnedMissingTag = true
      // eslint-disable-next-line no-console
      console.warn(
        '[injectAffiliateTag] NUXT_AMAZON_AFFILIATE_TAG is not set — Amazon links fall back to the source-data tag (or render un-attributed where the data has none). Set a per-site tag for correct attribution.',
      )
    }
  } else {
    // No per-site tag, but the data carries a real tag — keep it untouched.
    return product
  }

  return { ...product, amazon: { ...product.amazon, url: parsed.toString() } }
}
