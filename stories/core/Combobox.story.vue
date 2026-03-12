<script setup lang="ts">
import { ref } from 'vue'
import Combobox from '@core/primitives/Combobox.vue'
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
  <Story title="Combobox" icon="lucide:list">
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
