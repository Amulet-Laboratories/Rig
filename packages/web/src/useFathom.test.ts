import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFathom } from './useFathom'

describe('useFathom', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      fathom: {
        trackEvent: vi.fn(),
        trackPageview: vi.fn(),
      },
    })
  })

  it('tracks affiliate clicks with product slug', () => {
    const { trackAffiliateClick } = useFathom()
    trackAffiliateClick('hario-v60')
    expect(window.fathom?.trackEvent).toHaveBeenCalledWith('affiliate_click:hario-v60')
  })

  it('tracks newsletter signups with source', () => {
    const { trackNewsletterSignup } = useFathom()
    trackNewsletterSignup('article-footer')
    expect(window.fathom?.trackEvent).toHaveBeenCalledWith('newsletter_signup:article-footer')
  })

  it('tracks lead magnet downloads', () => {
    const { trackLeadMagnetDownload } = useFathom()
    trackLeadMagnetDownload('brew-cheatsheet')
    expect(window.fathom?.trackEvent).toHaveBeenCalledWith('lead_magnet:brew-cheatsheet')
  })

  it('tracks cross-site navigation', () => {
    const { trackCrossSiteNav } = useFathom()
    trackCrossSiteNav('quizsort.com')
    expect(window.fathom?.trackEvent).toHaveBeenCalledWith('cross_site_nav:quizsort.com')
  })

  it('tracks quiz embed views', () => {
    const { trackQuizEmbedView } = useFathom()
    trackQuizEmbedView('coffee-personality')
    expect(window.fathom?.trackEvent).toHaveBeenCalledWith('quiz_embed_view:coffee-personality')
  })

  it('tracks comparison views with both slugs', () => {
    const { trackComparisonView } = useFathom()
    trackComparisonView('hario-v60', 'chemex')
    expect(window.fathom?.trackEvent).toHaveBeenCalledWith('comparison_view:hario-v60-vs-chemex')
  })

  it('does not throw when fathom is not loaded', () => {
    vi.stubGlobal('window', {})
    const { trackAffiliateClick } = useFathom()
    expect(() => trackAffiliateClick('test')).not.toThrow()
  })
})
