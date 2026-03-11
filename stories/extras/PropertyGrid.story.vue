<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import PropertyGrid from '@extras/PropertyGrid.vue'

const { theme, themeOptions } = useHexTheme()

const items = [
  { key: 'Name', value: 'Rig' },
  { key: 'Version', value: '0.1.0', mono: true },
  { key: 'License', value: 'MIT' },
  { key: 'Components', value: '51' },
  { key: 'Package', value: '@amulet-laboratories/rig', mono: true },
  { key: 'Repository', value: 'github.com/Amulet-Laboratories/rig' },
]
</script>

<template>
  <Story title="Extras / PropertyGrid" icon="lucide:list-ordered">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Default">
      <div style="padding: 24px; max-width: 400px">
        <PropertyGrid :items="items" />
      </div>
    </Variant>

    <Variant title="Custom Key Width">
      <div style="padding: 24px; max-width: 400px">
        <PropertyGrid :items="items" key-width="140px" />
      </div>
    </Variant>
  </Story>
</template>
