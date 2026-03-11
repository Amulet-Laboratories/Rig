<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Icon from '@core/primitives/Icon.vue'
import type { Size } from '@core/types'
import { ref } from 'vue'

const { theme, themeOptions } = useHexTheme()

const size = ref<Size>('md')
</script>

<template>
  <Story title="Core / Icon" icon="lucide:image">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg', 'xl']" />
    </template>

    <Variant title="With Iconify Name">
      <div style="padding: 24px; display: flex; gap: 12px; align-items: center">
        <Icon icon="mdi:home" :size="size" label="Home" />
        <Icon icon="mdi:magnify" :size="size" label="Search" />
        <Icon icon="mdi:cog" :size="size" label="Settings" />
      </div>
    </Variant>

    <Variant title="Decorative (no label)">
      <div style="padding: 24px; display: flex; gap: 12px; align-items: center">
        <Icon icon="mdi:heart" :size="size" />
      </div>
    </Variant>

    <Variant title="All Sizes">
      <div style="padding: 24px; display: flex; gap: 12px; align-items: center">
        <Icon icon="mdi:star" size="xs" label="XS" />
        <Icon icon="mdi:star" size="sm" label="SM" />
        <Icon icon="mdi:star" size="md" label="MD" />
        <Icon icon="mdi:star" size="lg" label="LG" />
        <Icon icon="mdi:star" size="xl" label="XL" />
      </div>
    </Variant>
  </Story>
</template>
