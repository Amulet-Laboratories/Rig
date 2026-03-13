<script setup lang="ts">
import type { Orientation } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Bound selected value(s) */
    modelValue: string | string[]
    /** Whether only one item can be active at a time */
    type?: 'single' | 'multiple'
    /** Whether the group is disabled */
    disabled?: boolean
    /** Orientation for ARIA and keyboard helpers */
    orientation?: Orientation
  }>(),
  {
    type: 'single',
    orientation: 'horizontal',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
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
    <slot :isPressed="isPressed" :toggle="toggle" :disabled="disabled" />
  </div>
</template>
