<script setup lang="ts">
import { useTooltip } from '@core/composables'
import type { Component } from 'vue'
import type { Size } from '../types'

const props = withDefaults(
  defineProps<{
    /** Render as a different element or component (e.g. 'a', RouterLink) */
    as?: string | Component
    /** Visual variant — consumer defines meaning via CSS */
    variant?: string
    /** Size scale */
    size?: Size
    /** Whether the button is disabled */
    disabled?: boolean
    /** Whether the button is in a loading state */
    loading?: boolean
    /** Native button type (ignored when as != 'button') */
    type?: 'button' | 'submit' | 'reset'
    /** Iconify icon name — renders an icon span inside the button */
    icon?: string
    /** Accessible label (required for icon-only buttons) */
    ariaLabel?: string
    /** Tooltip text — shown after hover delay. Defaults to ariaLabel when icon-only. */
    tooltip?: string
    /** Tooltip placement */
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    as: 'button',
    size: 'md',
    type: 'button',
    tooltipPlacement: 'bottom',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const isNativeButton = !props.as || props.as === 'button'

const tip = useTooltip()

function onMouseEnter(e: MouseEvent) {
  const text = props.tooltip ?? props.ariaLabel
  if (text) tip.show(e.currentTarget as HTMLElement, text, props.tooltipPlacement)
}

function onMouseLeave() {
  tip.hide()
}

function onFocus(e: FocusEvent) {
  const text = props.tooltip ?? props.ariaLabel
  if (text) tip.show(e.currentTarget as HTMLElement, text, props.tooltipPlacement)
}

function onBlur() {
  tip.hide()
}
</script>

<template>
  <component
    :is="as"
    data-rig-button
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled || loading || undefined"
    :data-loading="loading || undefined"
    :data-icon-only="icon && !$slots.default ? '' : undefined"
    :disabled="isNativeButton ? disabled || loading : undefined"
    :aria-busy="loading || undefined"
    :aria-disabled="!isNativeButton && (disabled || loading) ? true : undefined"
    :aria-label="ariaLabel"
    :role="!isNativeButton ? 'button' : undefined"
    :tabindex="!isNativeButton && !(disabled || loading) ? 0 : undefined"
    :type="isNativeButton ? type : undefined"
    @click="$emit('click', $event)"
    @keydown.enter="!isNativeButton && $emit('click', $event)"
    @keydown.escape="onBlur"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focus="onFocus"
    @blur="onBlur"
  >
    <slot name="leading-icon">
      <span v-if="icon" data-rig-icon :data-size="size" aria-hidden="true">
        {{ icon }}
      </span>
    </slot>
    <slot />
    <slot name="trailing-icon" />
  </component>
</template>
