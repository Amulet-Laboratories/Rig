<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Badge from '@core/primitives/Badge.vue'
import type { Size } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const variant = ref('')
const size = ref<Size>('md')
</script>

<template>
  <Story title="Core / Badge" icon="lucide:tag">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstSelect
        v-model="variant"
        title="Variant"
        :options="['', 'success', 'warning', 'error', 'info']"
      />
      <HstSelect
        v-model="size"
        title="Size"
        :options="['xs', 'sm', 'md', 'lg', 'xl']"
      />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; display: flex; gap: 8px">
        <Badge :variant="variant || undefined" :size="size">Label</Badge>
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 24px; display: flex; gap: 8px; align-items: center">
        <Badge size="xs">XS</Badge>
        <Badge size="sm">SM</Badge>
        <Badge size="md">MD</Badge>
        <Badge size="lg">LG</Badge>
        <Badge size="xl">XL</Badge>
      </div>
    </Variant>

    <Variant title="Variants">
      <div style="padding: 24px; display: flex; gap: 8px; flex-wrap: wrap">
        <Badge>Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
      </div>
    </Variant>
  </Story>
</template>
