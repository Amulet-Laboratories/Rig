<script setup lang="ts">
import KeyboardHint from './KeyboardHint.vue'
</script>

<template>
  <Story title="KeyboardHint" icon="lucide:keyboard" group="menus">
    <Variant title="Default">
      <div
        style="
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          align-items: center;
          color: var(--foreground);
        "
      >
        <div style="display: flex; align-items: center; gap: 8px">
          Save <KeyboardHint shortcut="Ctrl+S" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          Find <KeyboardHint shortcut="Ctrl+F" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          Command Palette <KeyboardHint shortcut="Ctrl+Shift+P" />
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          Close Tab <KeyboardHint shortcut="Ctrl+W" />
        </div>
      </div>
    </Variant>

    <Variant title="Single Key">
      <div style="display: flex; gap: 16px; color: var(--foreground)">
        <KeyboardHint shortcut="Enter" />
        <KeyboardHint shortcut="Escape" />
        <KeyboardHint shortcut="Tab" />
        <KeyboardHint shortcut="Space" />
      </div>
    </Variant>
  </Story>
</template>
