<script setup lang="ts">
import { computed } from 'vue'
import { isMacPlatform } from '@core/composables/usePlatform'

const props = withDefaults(
  defineProps<{
    /** Keyboard shortcut string (e.g. 'Ctrl+Shift+P') */
    shortcut?: string
  }>(),
  {
    shortcut: '',
  },
)

const isMac = isMacPlatform()

const keys = computed(() =>
  props.shortcut.split('+').map((k) => {
    const trimmed = k.trim()
    if (isMac) {
      if (trimmed.toLowerCase() === 'ctrl' || trimmed.toLowerCase() === 'control') return '⌃'
      if (
        trimmed.toLowerCase() === 'cmd' ||
        trimmed.toLowerCase() === 'meta' ||
        trimmed.toLowerCase() === 'mod'
      )
        return '⌘'
      if (trimmed.toLowerCase() === 'alt' || trimmed.toLowerCase() === 'option') return '⌥'
      if (trimmed.toLowerCase() === 'shift') return '⇧'
    }
    return trimmed
  }),
)
</script>

<template>
  <kbd data-rig-keyboard-hint tabindex="-1" :aria-label="shortcut" @keydown.stop>
    <kbd v-for="(key, i) in keys" :key="i" data-rig-keyboard-hint-key>
      {{ key }}
    </kbd>
  </kbd>
</template>
