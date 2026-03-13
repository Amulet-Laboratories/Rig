import { ref, watch } from 'vue'

// Vite ?url imports — resolved URL per theme × mode combination
import obeliskDarkUrl from '@hex-dist/obelisk.css?url'
import obeliskLightUrl from '@hex-dist/obelisk-light.css?url'
import calciteLightUrl from '@hex-dist/calcite.css?url'
import calciteDarkUrl from '@hex-dist/calcite-dark.css?url'
import obsidianDarkUrl from '@hex-dist/obsidian.css?url'
import obsidianLightUrl from '@hex-dist/obsidian-light.css?url'
import vscodeDarkUrl from '@hex-dist/vscode.css?url'
import vscodeLightUrl from '@hex-dist/vscode-light.css?url'

export type Theme = 'obelisk' | 'calcite' | 'obsidian' | 'vscode'
export type Mode = 'light' | 'dark'

export interface ThemeEntry {
  id: Theme
  label: string
  description: string
}

export const themes: ThemeEntry[] = [
  { id: 'obelisk', label: 'Obelisk', description: 'Warm ink & bronze' },
  { id: 'calcite', label: 'Calcite', description: 'Warm parchment & earth' },
  { id: 'obsidian', label: 'Obsidian', description: 'High-contrast electric blue' },
  { id: 'vscode', label: 'VS Code', description: 'VS Code Modern' },
]

/** Maps theme × mode → CSS URL */
const themeUrls: Record<Theme, Record<Mode, string>> = {
  obelisk: { dark: obeliskDarkUrl, light: obeliskLightUrl },
  calcite: { dark: calciteDarkUrl, light: calciteLightUrl },
  obsidian: { dark: obsidianDarkUrl, light: obsidianLightUrl },
  vscode: { dark: vscodeDarkUrl, light: vscodeLightUrl },
}

const THEME_KEY = 'rig-demo-theme'
const MODE_KEY = 'rig-demo-mode'
const LINK_ID = 'hex-theme-stylesheet'

function applyTheme(theme: Theme, themeMode: Mode) {
  const url = themeUrls[theme][themeMode]
  const existing = document.getElementById(LINK_ID) as HTMLLinkElement | null

  if (existing) {
    existing.href = url
  } else {
    const link = document.createElement('link')
    link.id = LINK_ID
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
  }

  document.documentElement.style.colorScheme = themeMode
  document.documentElement.setAttribute('data-mode', themeMode)
}

// Resolve initial values — theme and mode are fully independent
const validThemes = themes.map((t) => t.id)
const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null
const storedMode = localStorage.getItem(MODE_KEY) as Mode | null
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const theme = ref<Theme>(
  storedTheme && validThemes.includes(storedTheme) ? storedTheme : 'obelisk',
)
const mode = ref<Mode>(storedMode === 'light' || storedMode === 'dark' ? storedMode : systemPrefersDark ? 'dark' : 'light')

function setMode(newMode: Mode) {
  mode.value = newMode
}

function setTheme(newTheme: Theme) {
  theme.value = newTheme
}

// Apply immediately on module load
applyTheme(theme.value, mode.value)

watch([theme, mode], ([nextTheme, nextMode]) => {
  localStorage.setItem(THEME_KEY, nextTheme)
  localStorage.setItem(MODE_KEY, nextMode)
  applyTheme(nextTheme, nextMode)
})

export function useTheme() {
  return {
    theme,
    mode,
    themes,
    setMode,
    setTheme,
  }
}
