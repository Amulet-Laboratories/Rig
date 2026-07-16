import { defineNuxtPlugin, useState } from 'nuxt/app'

/**
 * Primes every product into shared state once per request, so ProductCardWrapper
 * can read its product synchronously.
 *
 * Why this exists: the card used to do `await useAsyncData(...)` itself, which
 * makes it an async-setup component. When an article drops several
 * <ProductCardWrapper> into <ContentRenderer>, only the first async component
 * resolves in the MDC renderer — every card after the first silently vanished,
 * so a roundup listing five products showed one. Verified against production.
 *
 * The fix is to take the async out of the card entirely. This plugin runs before
 * any page or content renders, fetches the whole corpus in one call, and stores
 * it keyed by slug. The card then reads from `useState` in a plain computed —
 * synchronous setup, so all instances mount, and the data is already present at
 * SSR time (real product content in the HTML, not a hydration-time pop-in).
 *
 * Server-only: the single fetch happens during SSR and the result serialises
 * into the payload, so the client — including later SPA navigation to any other
 * article — reads the same state with no further request.
 *
 * One fetch of the full corpus per request is deliberate. It replaces N per-card
 * fetches, and because it holds every product, client-side navigation to any
 * article resolves its cards from state already in memory.
 */
export default defineNuxtPlugin(async () => {
  const store = useState<Record<string, unknown> | null>('rig:products', () => null)
  if (store.value !== null) return

  try {
    const list = await $fetch<Array<{ slug: string }>>('/api/products')
    const map: Record<string, unknown> = {}
    for (const product of list) map[product.slug] = product
    store.value = map
  } catch {
    // Never let a data hiccup take down the whole page render.
    store.value = {}
  }
})
