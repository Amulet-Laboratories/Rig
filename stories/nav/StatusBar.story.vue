<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import StatusBar from '@nav/StatusBar.vue'
import type { StatusBarItem } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const items: StatusBarItem[] = [
  { id: 'branch', content: 'main', align: 'left', priority: 1 },
  { id: 'errors', content: '0 errors', align: 'left', priority: 2 },
  { id: 'line', content: 'Ln 42, Col 8', align: 'right', priority: 1 },
  { id: 'lang', content: 'TypeScript', align: 'right', priority: 2 },
]
</script>

<template>
  <Story title="Nav / StatusBar" icon="lucide:panel-bottom-close">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="With Items">
      <StatusBar :items="items" />
    </Variant>

    <Variant title="Empty">
      <StatusBar />
    </Variant>
  </Story>
</template>
