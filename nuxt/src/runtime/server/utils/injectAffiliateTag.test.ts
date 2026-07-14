import { describe, it, expect } from 'vitest'
import { applyAffiliateTag } from './applyAffiliateTag'

const product = (url?: string) => ({ slug: 'x', amazon: { asin: 'B0', url } })

describe('applyAffiliateTag', () => {
  it('overwrites the baked-in data tag with the per-site tag when configured', () => {
    const out = applyAffiliateTag(
      product('https://amazon.com/dp/B07YVL8SF3?tag=ad029e-20'),
      'beanwoven-20',
    )
    expect(out.amazon.url).toBe('https://amazon.com/dp/B07YVL8SF3?tag=beanwoven-20')
  })

  it('keeps the baked-in data tag untouched when no per-site tag is set', () => {
    const url = 'https://amazon.com/dp/B07YVL8SF3?tag=ad029e-20'
    const out = applyAffiliateTag(product(url), '')
    expect(out.amazon.url).toBe(url)
  })

  it('injects the per-site tag onto an Amazon URL that has no tag param', () => {
    const out = applyAffiliateTag(product('https://amazon.com/dp/B07YVL8SF3'), 'beanwoven-20')
    expect(out.amazon.url).toBe('https://amazon.com/dp/B07YVL8SF3?tag=beanwoven-20')
  })

  it('strips the literal placeholder tag rather than shipping it', () => {
    const out = applyAffiliateTag(product('https://amazon.com/dp/B07YVL8SF3?tag=YOURTAG-20'), '')
    expect(out.amazon.url).toBe('https://amazon.com/dp/B07YVL8SF3')
  })

  it('replaces the placeholder with the per-site tag when configured', () => {
    const out = applyAffiliateTag(
      product('https://amazon.com/dp/B07YVL8SF3?tag=YOURTAG-20'),
      'beanwoven-20',
    )
    expect(out.amazon.url).toBe('https://amazon.com/dp/B07YVL8SF3?tag=beanwoven-20')
  })

  it('leaves non-Amazon retailer URLs untouched even with a per-site tag set', () => {
    const url = 'https://libro.fm/referral?ref=partner123'
    const out = applyAffiliateTag(product(url), 'beanwoven-20')
    expect(out.amazon.url).toBe(url)
  })

  it('handles co.uk and other Amazon TLDs', () => {
    const out = applyAffiliateTag(
      product('https://www.amazon.co.uk/dp/B07YVL8SF3?tag=ad029e-20'),
      'beanwoven-21',
    )
    expect(out.amazon.url).toBe('https://www.amazon.co.uk/dp/B07YVL8SF3?tag=beanwoven-21')
  })

  it('returns the product unchanged when there is no amazon url', () => {
    const p = { slug: 'x', amazon: { asin: 'B0' } }
    expect(applyAffiliateTag(p, 'beanwoven-20')).toBe(p)
  })
})
