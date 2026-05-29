/**
 * useBreadcrumbs — Breadcrumb array builder for content sites.
 *
 * Generates a breadcrumb trail from a page's category hierarchy.
 * Always starts with Home, adds category and subcategory segments,
 * and ends with the current page title.
 *
 * @example
 * const crumbs = useBreadcrumbs({
 *   title: 'Hario V60 Review',
 *   category: 'equipment-reviews',
 *   subcategory: 'pour-over',
 * })
 * // [
 * //   { label: 'Home', path: '/' },
 * //   { label: 'Equipment Reviews', path: '/equipment-reviews' },
 * //   { label: 'Pour Over', path: '/equipment-reviews/pour-over' },
 * //   { label: 'Hario V60 Review', path: '' },
 * // ]
 */

export interface ContentBreadcrumbItem {
  label: string
  path: string
}

export interface ContentBreadcrumbPage {
  title: string
  category?: string
  subcategory?: string
  path?: string
}

export const useBreadcrumbs = (page: ContentBreadcrumbPage): ContentBreadcrumbItem[] => {
  const breadcrumbs: ContentBreadcrumbItem[] = [{ label: 'Home', path: '/' }]

  if (page.category) {
    const categoryLabel = page.category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      label: categoryLabel,
      path: `/${page.category}`,
    })
  }

  if (page.subcategory) {
    const subcategoryLabel = page.subcategory
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({
      label: subcategoryLabel,
      path: `/${page.category}/${page.subcategory}`,
    })
  }

  breadcrumbs.push({
    label: page.title,
    path: page.path || '',
  })

  return breadcrumbs
}
