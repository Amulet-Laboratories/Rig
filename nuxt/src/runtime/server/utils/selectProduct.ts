import { parse } from 'yaml'

/**
 * The Nitro-free half of product lookup: which storage key belongs to a slug,
 * which keys are products at all, and how a raw asset becomes an object.
 *
 * Split out for the same reason {@link applyAffiliateTag} is split from
 * `injectAffiliateTag` — anything importing `nitropack/runtime` cannot be loaded
 * by Vitest outside a Nitro build, so the logic worth testing lives here and the
 * storage coupling stays in the thin wrapper.
 */

const SUFFIX = '.yaml'

/**
 * Products ship alongside a README.md and schema.md; only the YAML is data.
 * @returns {boolean}
 */
export function isProductKey(key) {
  return typeof key === 'string' && key.endsWith(SUFFIX)
}

/**
 * The storage key for a slug, or undefined.
 *
 * Nitro flattens the asset directory, joining path segments with `:`, so a
 * product at data/products/coffee/matcha-starter-kit.yaml arrives as the key
 * `coffee:matcha-starter-kit.yaml`.
 *
 * The match is anchored on the `:` separator rather than a bare `endsWith`,
 * which would make `starter-kit` match `coffee:matcha-starter-kit.yaml` and
 * return the wrong product.
 *
 * @returns {string | undefined}
 */
export function findProductKey(keys, slug) {
  const bare = `${slug}${SUFFIX}`
  return keys.find((key) => key === bare || key.endsWith(`:${bare}`))
}

/**
 * Parse a raw server asset into a product. Assets come back as strings; the
 * normalization is defensive against a driver handing back a Buffer.
 * @returns {Record<string, unknown> | null}
 */
export function parseProduct(raw) {
  if (raw === null || raw === undefined) return null
  return parse(typeof raw === 'string' ? raw : String(raw)) || null
}
