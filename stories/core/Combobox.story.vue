<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Combobox from '@core/primitives/Combobox.vue'

const { theme, themeOptions } = useHexTheme()

const value = ref<string | null>(null)

const options = [
  { id: 'js', label: 'JavaScript', description: 'Dynamic scripting language' },
  { id: 'ts', label: 'TypeScript', description: 'Typed superset of JavaScript' },
  { id: 'py', label: 'Python', description: 'General-purpose programming language' },
  { id: 'rs', label: 'Rust', description: 'Systems programming language' },
  { id: 'go', label: 'Go', description: 'Compiled language by Google' },
]
</script>

<template>
  <Story title="Core / Combobox" icon="lucide:list">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 320px">
        <Combobox
          v-model="value"
          :options="options"
          placeholder="Select a language..."
          clearable
        />
        <p style="margin-top: 12px; font-size: 13px">Selected: {{ value ?? 'none' }}</p>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 24px; max-width: 320px">
        <Combobox :options="options" placeholder="Disabled" disabled />
      </div>
    </Variant>
  </Story>
</template>
