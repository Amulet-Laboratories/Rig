import { ref, onMounted, onUnmounted } from 'vue'

/**
 * useHashRouter — hash-based page routing composable.
 *
 * Provides reactive page state with pushState/popstate integration.
 * Used by multi-page demo sites that route via URL hash fragments.
 */

export interface UseHashRouterOptions {
  /** Available pages — the first page is the default if no hash matches. */
  pages: Array<{ id: string; label: string }>
  /** Override the default page (defaults to first page's id). */
  defaultPage?: string
  /** Optional hash prefix (e.g. 'aldric-pace' → #aldric-pace/contact). */
  prefix?: string
}

export function useHashRouter(options: UseHashRouterOptions) {
  const { pages, prefix = '' } = options
  const defaultPage = options.defaultPage ?? pages[0]?.id ?? 'home'
  const currentPage = ref(defaultPage)

  function getPageFromHash(): string {
    const hash = window.location.hash.slice(1)
    const raw = prefix ? hash.replace(new RegExp(`^${prefix}/`), '') : hash
    return pages.some((p) => p.id === raw) ? raw : defaultPage
  }

  function navigateTo(page: string) {
    currentPage.value = page
    const hashPath = prefix ? `${prefix}/${page}` : page

    if (page === defaultPage) {
      history.pushState(null, '', window.location.pathname)
    } else {
      history.pushState(null, '', `#${hashPath}`)
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function onPopState() {
    currentPage.value = getPageFromHash()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  onMounted(() => {
    currentPage.value = getPageFromHash()
    window.addEventListener('popstate', onPopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', onPopState)
  })

  return { currentPage, navigateTo }
}
