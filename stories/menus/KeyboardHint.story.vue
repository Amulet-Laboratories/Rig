<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import KeyboardHint from '@menus/KeyboardHint.vue'

const { theme, themeOptions } = useHexTheme()
</script>

<template>
  <Story title="Menus / KeyboardHint" icon="lucide:keyboard">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Common Shortcuts">
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px">
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="min-width: 80px">Save</span>
          <KeyboardHint shortcut="Ctrl+S" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="min-width: 80px">Undo</span>
          <KeyboardHint shortcut="Ctrl+Z" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="min-width: 80px">Command</span>
          <KeyboardHint shortcut="Ctrl+Shift+P" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <span style="min-width: 80px">Delete</span>
          <KeyboardHint shortcut="Del" />
        </div>
      </div>
    </Variant>
  </Story>
</template>
