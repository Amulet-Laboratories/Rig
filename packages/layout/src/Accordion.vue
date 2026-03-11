<script setup lang="ts">
import { useId } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Open item ID (single) or IDs (multiple) */
    modelValue?: string | string[]
    /** Allow one or many items open simultaneously */
    type?: 'single' | 'multiple'
    /** In single mode, allow collapsing the open item */
    collapsible?: boolean
    /** Disable all items */
    disabled?: boolean
  }>(),
  {
    type: 'single',
    collapsible: true,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const instanceId = useId()

function isOpen(value: string): boolean {
  if (!props.modelValue) return false
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(value)
  return props.modelValue === value
}

function headerId(value: string): string {
  return `${instanceId}-accordion-header-${value}`
}

function panelId(value: string): string {
  return `${instanceId}-accordion-panel-${value}`
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
    const alreadyOpen = props.modelValue === value
    if (alreadyOpen && !props.collapsible) return
    emit('update:modelValue', alreadyOpen ? '' : value)
  }
}

function onKeydown(e: KeyboardEvent) {
  const headers = Array.from(
    (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
      '[data-rig-accordion-trigger]',
    ),
  )
  const currentIndex = headers.indexOf(e.target as HTMLElement)
  if (currentIndex < 0) return

  let nextIndex: number | null = null

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      nextIndex = (currentIndex + 1) % headers.length
      break
    case 'ArrowUp':
      e.preventDefault()
      nextIndex = (currentIndex - 1 + headers.length) % headers.length
      break
    case 'Home':
      e.preventDefault()
      nextIndex = 0
      break
    case 'End':
      e.preventDefault()
      nextIndex = headers.length - 1
      break
  }

  if (nextIndex !== null) {
    headers[nextIndex]?.focus()
  }
}
</script>

<template>
  <div
    data-rig-accordion
    :data-type="type"
    :data-disabled="disabled || undefined"
    @keydown="onKeydown"
  >
    <slot
      :isOpen="isOpen"
      :toggle="toggle"
      :disabled="disabled"
      :headerId="headerId"
      :panelId="panelId"
    />
  </div>
</template>
