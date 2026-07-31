/**
 * Parse a comma-separated runtime-config value into a list.
 *
 * Every one of these values arrives as a string from `nuxt.config.ts` or an
 * env var, and any of them can be absent — which is why this coerces rather
 * than assuming. The `String(value || '')` is the load-bearing part: calling
 * `.split()` on a config key that is undefined on the client throws during
 * hydration, and a throw in a page component takes down the whole app behind
 * Nuxt's error boundary instead of degrading to an empty list.
 *
 * That is not hypothetical. `ContentBestForIndexPage` did exactly this, and
 * `/best-for` rendered "500 Something went wrong" in every browser on all six
 * content-network sites while server-rendering a perfectly good page — so
 * curl, crawlers and uptime checks all saw 200 OK with real content.
 *
 * Plain JS with JSDoc rather than TypeScript on purpose: this is imported from
 * both a Vue component (Vite) and a Nitro server route (rollup), and rollup
 * parses it without a TS transform — a `.ts` file here fails the build with
 * "Expected ',', got ':'".
 *
 * @param {unknown} value
 * @returns {string[]}
 */
export function csv(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
