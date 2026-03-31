/**
 * useFathom — Analytics event tracking for content/authority sites.
 *
 * Tracks affiliate clicks, newsletter signups, cross-site navigation,
 * lead magnet downloads, quiz embed views, and comparison views.
 *
 * All tracking methods are no-ops when Fathom is not loaded (dev, missing config).
 * The Fathom script itself should be loaded via a client plugin that injects the
 * `window.fathom` global.
 *
 * @example
 * const { trackAffiliateClick, trackNewsletterSignup } = useFathom()
 * trackAffiliateClick('hario-v60')
 * trackNewsletterSignup('article-footer')
 */

declare global {
  interface Window {
    fathom?: {
      trackEvent: (name: string, opts?: { _value?: number }) => void
      trackPageview: () => void
    }
  }
}

export function useFathom() {
  function trackEvent(name: string) {
    if (typeof window !== 'undefined' && window.fathom) {
      window.fathom.trackEvent(name)
    }
  }

  const trackAffiliateClick = (productSlug: string) => trackEvent(`affiliate_click:${productSlug}`)

  const trackNewsletterSignup = (source: string) => trackEvent(`newsletter_signup:${source}`)

  const trackLeadMagnetDownload = (magnetSlug: string) => trackEvent(`lead_magnet:${magnetSlug}`)

  const trackCrossSiteNav = (targetSite: string) => trackEvent(`cross_site_nav:${targetSite}`)

  const trackQuizEmbedView = (quizSlug: string) => trackEvent(`quiz_embed_view:${quizSlug}`)

  const trackComparisonView = (slugA: string, slugB: string) =>
    trackEvent(`comparison_view:${slugA}-vs-${slugB}`)

  return {
    trackEvent,
    trackAffiliateClick,
    trackNewsletterSignup,
    trackLeadMagnetDownload,
    trackCrossSiteNav,
    trackQuizEmbedView,
    trackComparisonView,
  }
}
