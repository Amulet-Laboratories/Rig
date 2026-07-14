import { defineNuxtPlugin, useRuntimeConfig, useHead } from 'nuxt/app'

/**
 * Loads the Google AdSense script on every page when `adsenseClientId` is set,
 * which is what Auto Ads requires: Google scans each page and places units
 * itself, so the script cannot be scoped to pages that happen to render an
 * <AdUnit>.
 *
 * Auto Ads placement is toggled per-property in the AdSense dashboard; this
 * plugin only ships the loader. Manual <AdUnit> units keep working alongside
 * it — the shared `key` dedupes the tag so it is only ever injected once.
 *
 * NOTE: the site's CSP must allow the ad domains (script-src
 * pagead2.googlesyndication.com, etc.) or the browser will block this.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const clientId = config.public.adsenseClientId as string

  if (!clientId) return

  useHead({
    script: [
      {
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`,
        async: true,
        crossorigin: 'anonymous',
        key: 'adsense',
      },
    ],
  })
})
