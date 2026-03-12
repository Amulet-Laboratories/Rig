<script setup lang="ts">
import Tooltip from '@extras/Tooltip.vue'
import { useTooltip } from '@core/composables'
const tooltip = useTooltip()

function onEnter(e: MouseEvent) {
  tooltip.show(e.currentTarget as HTMLElement, 'Hello from Tooltip', 'bottom')
}

function onLeave() {
  tooltip.hide()
}
</script>

<template>
  <Story title="Tooltip" icon="lucide:message-square">
        <Variant title="Hover to Show">
      <div style="padding: 48px; text-align: center">
        <button @mouseenter="onEnter" @mouseleave="onLeave">Hover me</button>
      </div>
      <Tooltip />
    </Variant>
  </Story>
</template>
