<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import { useTooltip } from '@core/composables'

const tooltip = useTooltip()
const floatingRef = ref<HTMLElement | null>(null)

// Lazy middleware — only allocate once
let _middleware: ReturnType<typeof offset | typeof flip | typeof shift>[] | undefined
function getMiddleware() {
  if (!_middleware) _middleware = [offset(6), flip(), shift({ padding: 8 })]
  return _middleware
}

const { floatingStyles, placement: computedSide } = useFloating(tooltip.referenceEl, floatingRef, {
  placement: tooltip.placement,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: computed(getMiddleware),
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="tooltip.visible.value"
      ref="floatingRef"
      data-rig-tooltip
      data-state="visible"
      :data-side="computedSide"
      role="tooltip"
      tabindex="-1"
      :style="floatingStyles"
      @keydown.escape="tooltip.hide()"
    >
      {{ tooltip.content.value }}
    </div>
  </Teleport>
</template>
