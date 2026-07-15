import { useRuntimeConfig } from 'nuxt/app'

// Amazon OneLink-style geo-localization, without their script.
//
// Links are rendered/prerendered as `amazon.com` (correct for SEO + the US
// majority). On the client, when an international visitor clicks, we swap the
// link to their local Amazon storefront + this network's per-region Associates
// tag — so international traffic stops leaking uncredited.
//
// Per-region tags come from `runtimeConfig.public.amazonLocaleTags`, e.g.
// `{ GB: 'yourstore-21', DE: 'yourstore-01' }`. No site sets it today, so the
// map is empty, `localizeAmazon` returns its input, and this ships completely
// inert until international Associates accounts exist.
//
// Lived in seven identical copies under each site's composables/ before moving
// here — it is library behaviour, and every site had the same file.

const DOMAIN_BY_REGION: Record<string, string> = {
  GB: 'amazon.co.uk',
  CA: 'amazon.ca',
  DE: 'amazon.de',
  FR: 'amazon.fr',
  IT: 'amazon.it',
  ES: 'amazon.es',
  AU: 'amazon.com.au',
  JP: 'amazon.co.jp',
  IN: 'amazon.in',
  MX: 'amazon.com.mx',
  NL: 'amazon.nl',
  SE: 'amazon.se',
  PL: 'amazon.pl',
  BR: 'amazon.com.br',
}

export function useAmazonLocale() {
  const config = useRuntimeConfig()
  const tags = (config.public.amazonLocaleTags ?? {}) as Record<string, string>

  /** Return the visitor-localized Amazon URL, or the original if none applies. */
  function localizeAmazon(url: string): string {
    if (typeof navigator === 'undefined' || !url) return url
    if (!/(^|\.)amazon\.com([/?]|$)/.test(url)) return url

    const region = (navigator.language.split('-')[1] || '').toUpperCase()
    const domain = DOMAIN_BY_REGION[region]
    const tag = tags[region]
    if (!domain || !tag) return url // no localized storefront/tag configured

    try {
      const u = new URL(url)
      u.hostname = `www.${domain}`
      u.searchParams.set('tag', tag)
      return u.toString()
    } catch {
      return url
    }
  }

  return { localizeAmazon }
}
