import { ref, watchEffect } from 'vue'

export type ThemeName = 'obelisk' | 'calcite' | 'obsidian'

const TOKENS: Record<ThemeName, Record<string, string>> = {
  obelisk: {
    '--color-ink': '#0f0d0a',
    '--color-ink-light': '#1a1714',
    '--color-parchment': '#f5f1ed',
    '--color-bronze': '#c9956d',
    '--color-muted': '#8a8078',
    '--color-subtle': '#6b6560',
  },
  calcite: {
    '--color-ink': '#f8f5f1',
    '--color-ink-light': '#eee9e3',
    '--color-parchment': '#1a1714',
    '--color-bronze': '#a0714a',
    '--color-muted': '#6b6560',
    '--color-subtle': '#8a8078',
  },
  obsidian: {
    '--color-ink': '#000000',
    '--color-ink-light': '#0a0a0a',
    '--color-parchment': '#f0f0f0',
    '--color-bronze': '#60a5fa',
    '--color-muted': '#a3a3a3',
    '--color-subtle': '#737373',
  },
}

const THEME_OPTIONS = [
  { label: 'Obelisk (dark)', value: 'obelisk' },
  { label: 'Calcite (light)', value: 'calcite' },
  { label: 'Obsidian (high contrast)', value: 'obsidian' },
]

/**
 * Composable for switching Hex themes in Histoire stories.
 * Sets CSS custom properties on :root to override the compiled Hex token fallbacks.
 */
export function useHexTheme(initial: ThemeName = 'obelisk') {
  const theme = ref<ThemeName>(initial)

  watchEffect(() => {
    const tokens = TOKENS[theme.value]
    if (!tokens) return
    const root = document.documentElement
    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(key, value)
    }
  })

  return {
    theme,
    themes: Object.keys(TOKENS) as ThemeName[],
    themeOptions: THEME_OPTIONS,
  }
}
