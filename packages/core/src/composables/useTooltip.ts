import { ref, inject, provide, type Ref } from 'vue'
import { TooltipKey, type TooltipState, type TooltipVirtualEl } from '../injection-keys'
import { useReducedMotion } from './useReducedMotion'

function createTooltipState(prefersReducedMotion?: Readonly<Ref<boolean>>): TooltipState {
  const visible = ref(false)
  const content = ref('')
  const referenceEl = ref<HTMLElement | TooltipVirtualEl | null>(null)
  const placement = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')

  let showTimer: ReturnType<typeof setTimeout> | null = null

  function scheduleShow(
    el: HTMLElement | TooltipVirtualEl,
    text: string,
    p: 'top' | 'bottom' | 'left' | 'right',
  ) {
    if (showTimer) clearTimeout(showTimer)

    const delay = prefersReducedMotion?.value ? 0 : 500
    showTimer = setTimeout(() => {
      referenceEl.value = el
      placement.value = p
      content.value = text
      visible.value = true
    }, delay)
  }

  function show(
    target: HTMLElement,
    text: string,
    p: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  ) {
    scheduleShow(target, text, p)
  }

  function showAtPoint(
    x: number,
    y: number,
    text: string,
    p: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  ) {
    const virtualEl: TooltipVirtualEl = {
      getBoundingClientRect: () => DOMRect.fromRect({ x, y, width: 0, height: 0 }),
    }
    scheduleShow(virtualEl, text, p)
  }

  function hide() {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
    visible.value = false
    referenceEl.value = null
  }

  return { visible, content, referenceEl, placement, show, showAtPoint, hide }
}

/**
 * Access the tooltip controller.
 *
 * When called with `{ provide: true }`, creates and provides the controller.
 * Otherwise injects existing or creates standalone.
 */
export function useTooltip(options?: { provide?: boolean }): TooltipState {
  const reducedMotion = useReducedMotion()

  if (options?.provide) {
    const state = createTooltipState(reducedMotion)
    provide(TooltipKey, state)
    return state
  }

  const injected = inject(TooltipKey, null)
  if (injected) return injected

  if (import.meta.env?.DEV) {
    console.warn(
      '[Rig] useTooltip: No TooltipProvider found in ancestor tree. ' +
        'Tooltip state will be created standalone and may not render. ' +
        'Wrap your app (or the relevant subtree) with useTooltip({ provide: true }).',
    )
  }

  return createTooltipState(reducedMotion)
}
