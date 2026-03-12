<script setup lang="ts">
import Kbd from '@core/primitives/Kbd.vue'

</script>

<template>
  <Story title="Kbd" icon="lucide:keyboard">
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
