<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Button from '@core/primitives/Button.vue'
import type { Size } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const variant = ref('')
const size = ref<Size>('md')
const disabled = ref(false)
const loading = ref(false)
</script>

<template>
  <Story title="Core / Button" icon="lucide:square">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstSelect
        v-model="variant"
        title="Variant"
        :options="['', 'primary', 'ghost', 'danger']"
      />
      <HstSelect
        v-model="size"
        title="Size"
        :options="['xs', 'sm', 'md', 'lg', 'xl']"
      />
      <HstCheckbox v-model="disabled" title="Disabled" />
      <HstCheckbox v-model="loading" title="Loading" />
    </template>

    <Variant title="Interactive">
      <div style="display: flex; gap: 8px; padding: 24px; flex-wrap: wrap">
        <Button
          :variant="variant || undefined"
          :size="size"
          :disabled="disabled"
          :loading="loading"
        >
          Click me
        </Button>
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="display: flex; gap: 8px; padding: 24px; align-items: center">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
    </Variant>

    <Variant title="States">
      <div style="display: flex; gap: 8px; padding: 24px; flex-wrap: wrap">
        <Button>Default</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </div>
    </Variant>
  </Story>
</template>
