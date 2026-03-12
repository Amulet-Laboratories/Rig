<script setup lang="ts">
/**
 * Global wrapper for all Histoire stories.
 * Provides consistent padding, centering, and font inheritance.
 * Registered via addWrapper in setup.ts — no per-story import needed.
 *
 * Includes an optional Hex theme toggle (persisted in localStorage).
 * When a theme is active, it injects the pre-built Hex CSS via a <link> tag.
 * When set to "none", components render with scaffold styles only.
 */
import { useHexTheme } from './useHexTheme'

const { theme, hexThemes } = useHexTheme()
</script>

<template>
  <div data-rig-story-wrapper>
    <div data-rig-story-theme-bar>
      <label data-rig-story-theme-label>
        Hex Theme
        <select
          :value="theme"
          data-rig-story-theme-select
          @change="theme = ($event.target as HTMLSelectElement).value as typeof theme"
        >
          <option v-for="t in hexThemes" :key="t" :value="t">
            {{ t === 'none' ? 'None (scaffold)' : t.charAt(0).toUpperCase() + t.slice(1) }}
          </option>
        </select>
      </label>
    </div>
    <slot />
  </div>
</template>
