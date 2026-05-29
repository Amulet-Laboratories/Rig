import { describe, it, expect } from 'vitest'
import { useBreadcrumbs } from './useBreadcrumbs'

describe('useBreadcrumbs', () => {
  it('always includes Home as the first item', () => {
    const crumbs = useBreadcrumbs({ title: 'Test Page' })
    expect(crumbs[0]).toEqual({ label: 'Home', path: '/' })
  })

  it('builds crumbs with title only', () => {
    const crumbs = useBreadcrumbs({ title: 'About Us' })
    expect(crumbs).toHaveLength(2)
    expect(crumbs[1]).toEqual({ label: 'About Us', path: '' })
  })

  it('builds crumbs with category', () => {
    const crumbs = useBreadcrumbs({
      title: 'French Press Guide',
      category: 'brewing-guides',
    })
    expect(crumbs).toHaveLength(3)
    expect(crumbs[1]).toEqual({ label: 'Brewing Guides', path: '/brewing-guides' })
    expect(crumbs[2]).toEqual({ label: 'French Press Guide', path: '' })
  })

  it('builds crumbs with category and subcategory', () => {
    const crumbs = useBreadcrumbs({
      title: 'Hario V60 Review',
      category: 'equipment-reviews',
      subcategory: 'pour-over',
    })
    expect(crumbs).toHaveLength(4)
    expect(crumbs[1]).toEqual({ label: 'Equipment Reviews', path: '/equipment-reviews' })
    expect(crumbs[2]).toEqual({ label: 'Pour Over', path: '/equipment-reviews/pour-over' })
    expect(crumbs[3]).toEqual({ label: 'Hario V60 Review', path: '' })
  })

  it('title-cases hyphenated category slugs', () => {
    const crumbs = useBreadcrumbs({
      title: 'Test',
      category: 'beans-and-blends',
    })
    expect(crumbs[1]!.label).toBe('Beans And Blends')
  })

  it('uses the provided path for the current page', () => {
    const crumbs = useBreadcrumbs({
      title: 'My Article',
      path: '/articles/my-article',
    })
    expect(crumbs.at(-1)!.path).toBe('/articles/my-article')
  })
})
