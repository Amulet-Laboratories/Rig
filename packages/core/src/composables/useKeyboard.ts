import { ref, onMounted, onUnmounted, computed } from 'vue'
import { isMacPlatform } from './usePlatform'

function normalizeKey(key: string, isMac: boolean): string {
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
 *
 * Platform detection is deferred to `onMounted` so SSR-rendered pages always resolve the
 * correct platform on the client rather than using the server's navigator-less `false`.
 */
export function useKeyboard(shortcuts: Record<string, () => void>) {
  const normalizedMap = new Map<string, () => void>()
  const allowedInInput = new Set<string>(['escape'])
  const activeShortcutsRef = ref<string[]>([])

  function onKeyDown(e: KeyboardEvent) {
    const combo = eventToCombo(e)
    const handler = normalizedMap.get(combo)
    if (!handler) return
    if (isTextInput(e.target) && !allowedInInput.has(combo)) return
    e.preventDefault()
    try {
      handler()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[useKeyboard] handler for "${combo}" threw:`, err)
    }
  }

  onMounted(() => {
    const isMac = isMacPlatform()
    for (const [combo, handler] of Object.entries(shortcuts)) {
      normalizedMap.set(normalizeKey(combo, isMac), handler)
    }
    allowedInInput.add(normalizeKey('Mod+S', isMac))
    activeShortcutsRef.value = Array.from(normalizedMap.keys())
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })

  return {
    activeShortcuts: computed(() => activeShortcutsRef.value),
  }
}
