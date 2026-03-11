<script setup lang="ts">
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
  }>(),
  {
    as: 'button',
    size: 'md',
    type: 'button',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

const isNativeButton = !props.as || props.as === 'button'
</script>

<template>
  <component
    :is="as"
    data-rig-button
    :data-variant="variant"
    :data-size="size"
    :data-disabled="disabled || loading || undefined"
    :data-loading="loading || undefined"
    :disabled="isNativeButton ? disabled || loading : undefined"
    :aria-busy="loading || undefined"
    :aria-disabled="!isNativeButton && (disabled || loading) ? true : undefined"
    :role="!isNativeButton ? 'button' : undefined"
    :tabindex="!isNativeButton && !(disabled || loading) ? 0 : undefined"
    :type="isNativeButton ? type : undefined"
    @click="$emit('click', $event)"
  >
    <slot name="icon" />
    <slot />
  </component>
</template>
