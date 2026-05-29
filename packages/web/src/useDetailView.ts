import { ref, type Ref } from 'vue'

export interface UseDetailViewOptions {
  /** Scroll to top when selecting an item (default: true) */
  scrollToTop?: boolean
  /** Scroll behavior (default: 'smooth') */
  scrollBehavior?: ScrollBehavior
}

export interface UseDetailViewReturn<T> {
  /** Currently selected item, or null */
  selected: Ref<T | null>
  /** Select an item and optionally scroll to top */
  select: (item: T) => void
  /** Clear selection and return to list view */
  back: () => void
  /** Whether an item is currently selected */
  hasSelection: Ref<boolean>
}

/**
 * Composable for the common "list view / detail view" toggle pattern.
 *
 * Used when a page shows a grid of items (listings, products, exhibitions)
 * and clicking one switches to a detail view with a "Back to X" button.
 *
 * @example
 * ```ts
 * const { selected, select, back } = useDetailView<Property>()
 *
 * // In template:
 * // <template v-if="selected"> ... detail view ... </template>
 * // <template v-else> ... grid view ... </template>
 * ```
 */
export function useDetailView<T>(options: UseDetailViewOptions = {}): UseDetailViewReturn<T> {
  const { scrollToTop = true, scrollBehavior = 'smooth' } = options

  const selected = ref<T | null>(null) as Ref<T | null>

  const hasSelection = ref(false)

  function select(item: T) {
    selected.value = item
    hasSelection.value = true
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: scrollBehavior })
    }
  }

  function back() {
    selected.value = null
    hasSelection.value = false
  }

  return { selected, select, back, hasSelection }
}
