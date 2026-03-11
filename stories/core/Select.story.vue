<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Select from '@core/primitives/Select.vue'

const { theme, themeOptions } = useHexTheme()

const value = ref('')
const disabled = ref(false)

const options = [
  { id: 'vue', label: 'Vue' },
  { id: 'react', label: 'React' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'solid', label: 'Solid', disabled: true },
]
</script>

<template>
  <Story title="Core / Select" icon="lucide:chevron-down">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 280px">
        <Select
          v-model="value"
          :options="options"
          placeholder="Choose a framework"
          :disabled="disabled"
        />
      </div>
    </Variant>

    <Variant title="States">
      <div style="padding: 24px; max-width: 280px; display: flex; flex-direction: column; gap: 12px">
        <Select :options="options" placeholder="Default" />
        <Select :options="options" model-value="vue" />
        <Select :options="options" placeholder="Disabled" disabled />
      </div>
    </Variant>
  </Story>
</template>
