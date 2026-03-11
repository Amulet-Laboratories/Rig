<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Kbd from '@core/primitives/Kbd.vue'

const { theme, themeOptions } = useHexTheme()
</script>

<template>
  <Story title="Core / Kbd" icon="lucide:keyboard">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Single Keys">
      <div style="padding: 24px; display: flex; gap: 8px; align-items: center">
        <Kbd keys="Esc" />
        <Kbd keys="Tab" />
        <Kbd keys="Enter" />
        <Kbd keys="Space" />
        <Kbd keys="Backspace" />
      </div>
    </Variant>

    <Variant title="Modifiers">
      <div style="padding: 24px; display: flex; gap: 16px; align-items: center">
        <span style="display: flex; gap: 4px; align-items: center">
          <Kbd keys="Ctrl" /> + <Kbd keys="C" />
        </span>
        <span style="display: flex; gap: 4px; align-items: center">
          <Kbd keys="Ctrl" /> + <Kbd keys="Shift" /> + <Kbd keys="P" />
        </span>
        <span style="display: flex; gap: 4px; align-items: center">
          <Kbd keys="Alt" /> + <Kbd keys="F4" />
        </span>
      </div>
    </Variant>
  </Story>
</template>
