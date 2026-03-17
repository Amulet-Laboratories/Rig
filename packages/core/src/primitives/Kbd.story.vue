<script setup lang="ts">
import Kbd from './Kbd.vue'
</script>

<template>
  <Story title="Kbd" icon="lucide:keyboard" group="core">
    <Variant title="Default">
      <Kbd keys="Ctrl+S" />
    </Variant>

    <Variant title="Common Shortcuts">
      <div style="display: flex; gap: 24px; flex-wrap: wrap; color: var(--foreground)">
        <div style="display: flex; align-items: center; gap: 8px">Save <Kbd keys="Ctrl+S" /></div>
        <div style="display: flex; align-items: center; gap: 8px">Copy <Kbd keys="Ctrl+C" /></div>
        <div style="display: flex; align-items: center; gap: 8px">Paste <Kbd keys="Ctrl+V" /></div>
        <div style="display: flex; align-items: center; gap: 8px">Undo <Kbd keys="Ctrl+Z" /></div>
        <div style="display: flex; align-items: center; gap: 8px">Find <Kbd keys="Ctrl+F" /></div>
      </div>
    </Variant>

    <Variant title="With Slot Content">
      <Kbd>Enter</Kbd>
    </Variant>
  </Story>
</template>
