import { ref, inject, provide } from 'vue'
import { TooltipKey, type TooltipState } from '../injection-keys'

function createTooltipState(): TooltipState {
  const visible = ref(false)
  const content = ref('')
  const referenceEl = ref<HTMLElement | null>(null)
  const placement = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')

  let showTimer: ReturnType<typeof setTimeout> | null = null

  function show(
    target: HTMLElement,
    text: string,
    p: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  ) {
    if (showTimer) clearTimeout(showTimer)

    showTimer = setTimeout(() => {
      referenceEl.value = target
      placement.value = p
      content.value = text
      visible.value = true
    }, 500)
  }

  function hide() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
    visible.value = false
    referenceEl.value = null
  }

  return { visible, content, referenceEl, placement, show, hide }
}

/**
 * Access the tooltip controller.
 *
 * When called with `{ provide: true }`, creates and provides the controller.
 * Otherwise injects existing or creates standalone.
 */
export function useTooltip(options?: { provide?: boolean }): TooltipState {
  if (options?.provide) {
    const state = createTooltipState()
    provide(TooltipKey, state)
    return state
  }

  const injected = inject(TooltipKey, null)
  if (injected) return injected

  return createTooltipState()
}
