import { useStorage } from 'nitropack/runtime'
import { isProductKey, findProductKey, parseProduct } from './selectProduct'

/**
 * Reads the product corpus out of the `products` server asset.
 *
 * The data is reached through Nitro storage rather than the filesystem. The
 * previous implementation did
 * `readFileSync(resolve(process.cwd(), 'data/products', niche, slug + '.yaml'))`,
 * which works perfectly in dev — cwd is the repo root and the files are there —
 * and finds nothing at all in a deployed function, because a path assembled from
 * a router param is invisible to the bundler and none of the data ships. The
 * failure was silent: the index handler returned `[]` rather than erroring, so
 * every product card rendered empty and no affiliate link ever reached a page.
 *
 * The module registers `data/products` as a server asset, so the corpus is part
 * of the build output by construction rather than by the tracer's good luck.
 *
 * Key shape and slug matching live in {@link selectProduct}, which is testable.
 */

function assets() {
  return useStorage('assets:products')
}

/**
 * Bundled assets are immutable for the life of a deploy, so the parsed corpus is
 * cached in production. Not cached in dev, where assets are read live and
 * editing a product should take effect without a restart.
 */
let cached = null

/**
 * Every product in the corpus.
 *
 * Note there is no hardcoded list of niches: the keys are whatever was bundled.
 * The old handlers iterated a literal array of eleven niche names, so a twelfth
 * directory would have been invisible with nothing to indicate why.
 *
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function readAllProducts() {
  if (cached && process.env.NODE_ENV === 'production') return cached

  const storage = assets()
  const keys = await storage.getKeys()
  const products = []

  for (const key of keys) {
    if (!isProductKey(key)) continue
    const product = parseProduct(await storage.getItem(key))
    if (product) products.push(product)
  }

  if (process.env.NODE_ENV === 'production') cached = products
  return products
}

/**
 * One product by slug, or null if the corpus has no such slug.
 * @returns {Promise<Record<string, unknown> | null>}
 */
export async function readProduct(slug) {
  const storage = assets()
  const key = findProductKey(await storage.getKeys(), slug)
  if (!key) return null
  return parseProduct(await storage.getItem(key))
}
