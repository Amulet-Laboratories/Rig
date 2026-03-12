import { ref, watch, onUnmounted } from 'vue'

/**
 * Available Hex themes that can be loaded in Histoire.
 * 'none' uses the built-in scaffold styles only.
 */
export type HexTheme = 'none' | 'obelisk' | 'calcite' | 'obsidian' | 'vscode'

export const hexThemes: HexTheme[] = ['none', 'obelisk', 'calcite', 'obsidian', 'vscode']

const STORAGE_KEY = 'rig-histoire-hex-theme'
const LINK_ID = 'hex-theme-stylesheet'

/** Resolve the dist CSS URL for a given theme. */
function resolveThemeUrl(theme: Exclude<HexTheme, 'none'>): string {
  // Vite serves node_modules files via /@fs/ or direct dep resolution.
  // The Hex package exports "./obelisk": "./dist/obelisk.css" etc.
  // We use the node_modules path which Vite will serve in dev.
  return `/node_modules/@amulet-laboratories/hex/dist/${theme}.css`
}

/** Inject or swap a <link> for the chosen Hex theme. */
function applyTheme(theme: HexTheme) {
  const existing = document.getElementById(LINK_ID)

  if (theme === 'none') {
    existing?.remove()
    return
  }

  const url = resolveThemeUrl(theme)

  if (existing instanceof HTMLLinkElement) {
    existing.href = url
  } else {
    const link = document.createElement('link')
    link.id = LINK_ID
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
  }
}

/**
 * Composable for toggling Hex themes in Histoire stories.
 * Persists the selected theme in localStorage across reloads.
 */
export function useHexTheme() {
  const stored = (localStorage.getItem(STORAGE_KEY) ?? 'none') as HexTheme
  const theme = ref<HexTheme>(
    hexThemes.includes(stored) ? stored : 'none',
  )

  // Apply immediately on creation
  applyTheme(theme.value)

  watch(theme, (next) => {
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  })

  onUnmounted(() => {
    // Clean up when the wrapper unmounts (e.g., HMR)
    document.getElementById(LINK_ID)?.remove()
  })

  return { theme, hexThemes }
}
