<script setup lang="ts">
import type { Orientation, Size } from '@core/types'

export interface ToggleItem {
  /** Unique value for this toggle */
  value: string
  /** Display label */
  label?: string
  /** Accessible label (falls back to label, then value) */
  ariaLabel?: string
  /** Whether this item is disabled */
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Bound selected value(s) */
    modelValue: string | string[]
    /** Toggle items — when provided, ToggleGroup renders buttons internally */
    items?: ToggleItem[]
    /** Whether only one item can be active at a time */
    type?: 'single' | 'multiple'
    /** Whether the group is disabled */
    disabled?: boolean
    /** Orientation for ARIA and keyboard helpers */
    orientation?: Orientation
    /** Visual variant applied to rendered buttons */
    variant?: string
    /** Size scale applied to rendered buttons */
    size?: Size
  }>(),
  {
    type: 'single',
    disabled: false,
    orientation: 'horizontal',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

defineSlots<{
  default: (props: {
    isPressed: (value: string) => boolean
    toggle: (value: string) => void
    disabled: boolean
  }) => unknown
  item: (props: { item: ToggleItem; pressed: boolean; disabled: boolean }) => unknown
}>()

function isPressed(value: string): boolean {
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(value)
  return props.modelValue === value
}

function toggle(value: string) {
  if (props.disabled) return
  if (props.type === 'multiple') {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(value)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(value)
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', props.modelValue === value ? '' : value)
  }
}

function onKeydown(e: KeyboardEvent) {
  const buttons = Array.from(
    (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button:not([disabled])'),
  )
  const idx = buttons.indexOf(e.target as HTMLElement)
  if (idx < 0) return

  const isHorizontal = props.orientation === 'horizontal'
  let next: number | null = null
  switch (e.key) {
    case isHorizontal ? 'ArrowRight' : 'ArrowDown':
      e.preventDefault()
      next = (idx + 1) % buttons.length
      break
    case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
      e.preventDefault()
      next = (idx - 1 + buttons.length) % buttons.length
      break
  }
  if (next !== null) buttons[next]?.focus()
}
</script>

<template>
  <div
    data-rig-toggle-group
    role="group"
    :aria-label="`Toggle group (${type})`"
    :data-type="type"
    :data-orientation="orientation"
    :data-disabled="disabled || undefined"
    @keydown="onKeydown"
  >
    <!-- Items mode: ToggleGroup renders buttons internally -->
    <template v-if="items && items.length">
      <button
        v-for="item in items"
        :key="item.value"
        data-rig-toggle
        type="button"
        :aria-pressed="isPressed(item.value)"
        :data-state="isPressed(item.value) ? 'on' : 'off'"
        :data-variant="variant"
        :data-size="size"
        :data-disabled="disabled || item.disabled || undefined"
        :disabled="disabled || item.disabled"
        :aria-label="item.ariaLabel ?? item.label ?? item.value"
        tabindex="0"
        @click="toggle(item.value)"
        @keydown.enter.prevent="toggle(item.value)"
      >
        <slot name="item" :item="item" :pressed="isPressed(item.value)" :disabled="disabled || !!item.disabled">
          {{ item.label ?? item.value }}
        </slot>
      </button>
    </template>

    <!-- Slot mode: consumer provides custom content -->
    <slot v-else :isPressed="isPressed" :toggle="toggle" :disabled="disabled" />
  </div>
</template>
