<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import View from '@nav/View.vue'
import type { Action } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const collapsed = ref(false)
const actions: Action[] = [
  { id: 'new-file', label: 'New File' },
  { id: 'refresh', label: 'Refresh' },
]
</script>

<template>
  <Story title="Nav / View" icon="lucide:panel-top">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstCheckbox v-model="collapsed" title="Collapsed" />
    </template>

    <Variant title="Default">
      <View v-model:collapsed="collapsed" title="Explorer" :actions="actions">
        <div style="padding: 8px">View content here</div>
      </View>
    </Variant>

    <Variant title="No Actions">
      <View v-model:collapsed="collapsed" title="Outline">
        <div style="padding: 8px">Simple view content</div>
      </View>
    </Variant>
  </Story>
</template>
