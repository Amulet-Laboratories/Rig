<script setup lang="ts">
import { computed } from 'vue'
import type { Action } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Action items */
    actions: Action[]
    /** Maximum visible items before overflow to menu */
    maxVisible?: number
  }>(),
  {
    maxVisible: Infinity,
  },
)

const emit = defineEmits<{
  select: [action: Action]
}>()

const visibleActions = computed(() =>
  props.maxVisible < props.actions.length
    ? props.actions.slice(0, props.maxVisible)
    : props.actions,
)

const overflowActions = computed(() =>
  props.maxVisible < props.actions.length ? props.actions.slice(props.maxVisible) : [],
)

function onKeydown(e: KeyboardEvent) {
  const buttons = Array.from(
    (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button:not([disabled])'),
  )
  const idx = buttons.indexOf(e.target as HTMLElement)
  if (idx < 0) return

  let next: number | null = null
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      next = (idx + 1) % buttons.length
      break
    case 'ArrowLeft':
      e.preventDefault()
      next = (idx - 1 + buttons.length) % buttons.length
      break
    case 'Home':
      e.preventDefault()
      next = 0
      break
    case 'End':
      e.preventDefault()
      next = buttons.length - 1
      break
  }
  if (next !== null) buttons[next]?.focus()
}
</script>

<template>
  <div data-rig-action-bar role="toolbar" aria-orientation="horizontal" @keydown="onKeydown">
    <button
      v-for="action in visibleActions"
      :key="action.id"
      data-rig-action-bar-item
      :aria-label="action.label"
      :disabled="action.disabled"
      :data-disabled="action.disabled || undefined"
      @click="emit('select', action)"
    >
      <slot name="action" :action="action">
        {{ action.label }}
      </slot>
    </button>
    <button
      v-if="overflowActions.length > 0"
      data-rig-action-bar-overflow
      aria-label="More actions"
      aria-haspopup="true"
    >
      <slot name="overflow-trigger">&hellip;</slot>
    </button>
  </div>
</template>
