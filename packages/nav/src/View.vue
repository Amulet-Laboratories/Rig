<script setup lang="ts">
import { useTooltip } from '@core/composables'
import type { Action, ID } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Section title */
    title: string
    /** Whether the section is collapsed */
    collapsed?: boolean
    /** Action buttons shown in the header */
    actions?: Action[]
  }>(),
  {
    collapsed: false,
    actions: () => [],
  },
)

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  action: [id: ID]
}>()

const tooltip = useTooltip()

function toggle() {
  emit('update:collapsed', !props.collapsed)
}

function onActionMouseEnter(e: MouseEvent, action: Action) {
  tooltip.show(e.currentTarget as HTMLElement, action.label, 'bottom')
}

function onActionMouseLeave() {
  tooltip.hide()
}
</script>

<template>
  <section data-rig-view :data-collapsed="collapsed || undefined">
    <div
      data-rig-view-header
      role="button"
      :aria-expanded="!collapsed"
      tabindex="0"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <span data-rig-view-chevron :data-state="collapsed ? 'closed' : 'open'" aria-hidden="true" />
      <slot name="header">
        <span data-rig-view-title>{{ title }}</span>
      </slot>
      <div v-if="actions.length > 0" data-rig-view-actions>
        <slot name="actions">
          <button
            v-for="action in actions"
            :key="action.id"
            data-rig-view-action
            :aria-label="action.label"
            :disabled="action.disabled"
            @click.stop="emit('action', action.id)"
            @mouseenter="(e) => onActionMouseEnter(e, action)"
            @mouseleave="onActionMouseLeave"
          >
            <slot name="action-icon" :action="action">
              {{ action.icon ?? action.label }}
            </slot>
          </button>
        </slot>
      </div>
    </div>
    <div v-if="!collapsed" data-rig-view-content>
      <slot />
    </div>
  </section>
</template>
