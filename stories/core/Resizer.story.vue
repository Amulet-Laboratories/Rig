<script setup lang="ts">
import Resizer from '@core/primitives/Resizer.vue'
import { ref } from 'vue'
const width = ref(300)
const height = ref(200)
</script>

<template>
  <Story title="Resizer" icon="lucide:grip-vertical">
        <Variant title="Horizontal">
      <div style="padding: 24px; display: flex; height: 200px">
        <div :style="{ width: width + 'px', background: 'var(--rig-surface, #1e1e1e)', padding: '12px' }">
          Left pane ({{ width }}px)
        </div>
        <Resizer orientation="horizontal" @drag="({ delta }) => { width = Math.max(100, width + delta) }" />
        <div style="flex: 1; background: var(--rig-surface-alt, #252526); padding: 12px">
          Right pane
        </div>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="padding: 24px; display: flex; flex-direction: column; width: 400px">
        <div :style="{ height: height + 'px', background: 'var(--rig-surface, #1e1e1e)', padding: '12px' }">
          Top pane ({{ height }}px)
        </div>
        <Resizer orientation="vertical" @drag="({ delta }) => { height = Math.max(80, height + delta) }" />
        <div style="height: 150px; background: var(--rig-surface-alt, #252526); padding: 12px">
          Bottom pane
        </div>
      </div>
    </Variant>
  </Story>
</template>
