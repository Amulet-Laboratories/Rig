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
  props.maxVisible < props.actions.length
    ? props.actions.slice(props.maxVisible)
    : [],
)
</script>

<template>
  <div data-rig-action-bar role="toolbar">
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
