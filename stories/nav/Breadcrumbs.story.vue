<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Breadcrumbs from '@nav/Breadcrumbs.vue'

const { theme, themeOptions } = useHexTheme()

const items = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'rig', label: 'Rig' },
  { id: 'core', label: 'Core' },
]
</script>

<template>
  <Story title="Navigation / Breadcrumbs" icon="lucide:chevrons-right">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Default">
      <div style="padding: 24px">
        <Breadcrumbs :items="items" />
      </div>
    </Variant>

    <Variant title="Custom Separator">
      <div style="padding: 24px">
        <Breadcrumbs :items="items" separator="›" />
      </div>
    </Variant>

    <Variant title="Short Path">
      <div style="padding: 24px">
        <Breadcrumbs :items="[{ id: 'home', label: 'Home' }, { id: 'settings', label: 'Settings' }]" />
      </div>
    </Variant>
  </Story>
</template>
