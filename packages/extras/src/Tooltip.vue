<script setup lang="ts">
import { ref } from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import { useTooltip } from '@core/composables'

const tooltip = useTooltip()
const floatingRef = ref<HTMLElement | null>(null)

const { floatingStyles, placement: computedSide } = useFloating(tooltip.referenceEl, floatingRef, {
  placement: tooltip.placement,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(6), flip(), shift({ padding: 8 })],
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="tooltip.visible.value"
      ref="floatingRef"
      data-rig-tooltip
      :data-state="tooltip.visible.value ? 'visible' : 'hidden'"
      :data-side="computedSide"
      role="tooltip" tabindex="-1" @keydown.escape="tooltip.hide()"
      :style="floatingStyles"
    >
      {{ tooltip.content.value }}
    </div>
  </Teleport>
</template>
