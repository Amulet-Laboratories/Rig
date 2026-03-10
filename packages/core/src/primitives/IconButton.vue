<script setup lang="ts">
import { useTooltip } from '@core/composables'
import type { Component } from 'vue'
import type { Size } from '../types'
import Button from './Button.vue'

const props = withDefaults(
  defineProps<{
    /** Accessible label (required for icon-only buttons) */
    ariaLabel: string
    /** Render as a different element or component (e.g. 'a', RouterLink) */
    as?: string | Component
    /** Iconify icon name */
    icon?: string
    /** Visual variant */
    variant?: string
    /** Size scale */
    size?: Size
    /** Whether the button is disabled */
    disabled?: boolean
    /** Whether the button is in a loading state */
    loading?: boolean
    /** Tooltip text — shown after 500 ms hover. Defaults to ariaLabel. */
    tooltip?: string
    /** Tooltip placement */
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    size: 'md',
    tooltipPlacement: 'bottom',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const tip = useTooltip()

function onMouseEnter(e: MouseEvent) {
  const text = props.tooltip ?? props.ariaLabel
  if (text) tip.show(e.currentTarget as HTMLElement, text, props.tooltipPlacement)
}

function onMouseLeave() {
  tip.hide()
}
</script>

<template>
  <Button
    data-rig-icon-button
    :as="as"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot>
      <span v-if="icon" data-rig-icon :data-size="size" aria-hidden="true">
        {{ icon }}
      </span>
    </slot>
  </Button>
</template>
