import { describe, it, expect } from 'vitest'
import { isProductKey, findProductKey, parseProduct } from './selectProduct'

/**
 * These guard the storage contract, which is where the old implementation went
 * wrong: the corpus was read off disk via a path built from a router param, so
 * it worked in dev and shipped nothing to production. Nitro flattens the asset
 * directory into `<niche>:<slug>.yaml` keys, and getting that separator or the
 * suffix match wrong fails the same silent way — an empty list, not an error.
 */

const KEYS = [
  'coffee:matcha-starter-kit.yaml',
  'coffee:starter-kit.yaml',
  'pets:dog-brush.yaml',
  'README.md',
  'schema.md',
]

describe('isProductKey', () => {
  it('accepts yaml keys', () => {
    expect(isProductKey('pets:dog-brush.yaml')).toBe(true)
  })

  it('rejects the README and schema shipped alongside the data', () => {
    expect(isProductKey('README.md')).toBe(false)
    expect(isProductKey('schema.md')).toBe(false)
  })
})

describe('findProductKey', () => {
  it('finds a product regardless of which niche it sits in', () => {
    expect(findProductKey(KEYS, 'dog-brush')).toBe('pets:dog-brush.yaml')
  })

  it('does not match a slug that is only a suffix of a longer one', () => {
    // A bare endsWith('starter-kit.yaml') would wrongly return the matcha kit.
    expect(findProductKey(KEYS, 'starter-kit')).toBe('coffee:starter-kit.yaml')
  })

  it('matches a product sitting at the corpus root, with no niche prefix', () => {
    expect(findProductKey(['loose.yaml'], 'loose')).toBe('loose.yaml')
  })

  it('returns undefined for an unknown slug rather than a wrong product', () => {
    expect(findProductKey(KEYS, 'no-such-thing')).toBeUndefined()
  })
})

describe('parseProduct', () => {
  it('parses a yaml asset into an object', () => {
    expect(parseProduct('slug: dog-brush\nname: Dog Brush\n')).toMatchObject({
      slug: 'dog-brush',
      name: 'Dog Brush',
    })
  })

  it('returns null for a missing asset instead of throwing', () => {
    expect(parseProduct(null)).toBeNull()
    expect(parseProduct(undefined)).toBeNull()
  })

  it('returns null for an empty asset rather than a falsy non-object', () => {
    expect(parseProduct('')).toBeNull()
  })
})
