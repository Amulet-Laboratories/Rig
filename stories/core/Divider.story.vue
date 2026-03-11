<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Divider from '@core/primitives/Divider.vue'

const { theme, themeOptions } = useHexTheme()

const vertical = ref(false)
const label = ref('')
</script>

<template>
  <Story title="Core / Divider" icon="lucide:minus">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstCheckbox v-model="vertical" title="Vertical" />
      <HstText v-model="label" title="Label" />
    </template>

    <Variant title="Horizontal">
      <div style="padding: 24px; max-width: 400px">
        <p style="margin-bottom: 8px">Content above</p>
        <Divider :label="label || undefined" />
        <p style="margin-top: 8px">Content below</p>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="padding: 24px; display: flex; gap: 0; align-items: center; height: 60px">
        <span>Left</span>
        <Divider vertical />
        <span>Right</span>
      </div>
    </Variant>

    <Variant title="With Label">
      <div style="padding: 24px; max-width: 400px">
        <Divider label="OR" />
      </div>
    </Variant>
  </Story>
</template>
