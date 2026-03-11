import { onMounted, onUnmounted, computed } from 'vue'

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)

function normalizeKey(key: string): string {
  return key
    .split('+')
    .map((k) => {
      const lower = k.trim().toLowerCase()
      if (lower === 'mod' || lower === 'cmd' || lower === 'meta') return isMac ? 'meta' : 'ctrl'
      if (lower === 'ctrl' || lower === 'control') return 'ctrl'
      if (lower === 'alt' || lower === 'option') return 'alt'
      return lower
    })
    .sort()
    .join('+')
}

function eventToCombo(e: KeyboardEvent): string {
  const parts: string[] = []
  if (e.ctrlKey) parts.push('ctrl')
  if (e.metaKey) parts.push('meta')
  if (e.altKey) parts.push('alt')
  if (e.shiftKey) parts.push('shift')

  const key = e.key.toLowerCase()
  if (!['control', 'meta', 'alt', 'shift'].includes(key)) {
    parts.push(key)
  }

  return parts.sort().join('+')
}

function isTextInput(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false
  const tag = el.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea') return true
  if (el.isContentEditable) return true
  return false
}

/**
 * Register global keyboard shortcuts.
 *
 * Keys use combo format: 'Ctrl+K', 'Cmd+Shift+P', 'Mod+S' (Mod = Cmd on Mac, Ctrl elsewhere).
 * Shortcuts are suppressed when focus is in text inputs, except for Escape and Mod+S.
 */
export function useKeyboard(shortcuts: Record<string, () => void>) {
  const normalizedMap = new Map<string, () => void>()

  for (const [combo, handler] of Object.entries(shortcuts)) {
    normalizedMap.set(normalizeKey(combo), handler)
  }

  const allowedInInput = new Set(['escape', normalizeKey('Mod+S')])

  function onKeyDown(e: KeyboardEvent) {
    const combo = eventToCombo(e)
    const handler = normalizedMap.get(combo)

    if (!handler) return

    if (isTextInput(e.target) && !allowedInInput.has(combo)) return

    e.preventDefault()
    handler()
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })

  return {
    activeShortcuts: computed(() => Array.from(normalizedMap.keys())),
  }
}
