<script setup lang="ts">
import type { ID } from '@core/types'

withDefaults(
  defineProps<{
    /** Whether the sidebar is visible */
    open?: boolean
    /** ID of the currently active view */
    activeViewId?: ID
    /** Sidebar width in pixels */
    width?: number
  }>(),
  {
    open: true,
    width: 260,
  },
)

defineEmits<{
  'update:open': [value: boolean]
  'update:activeViewId': [id: ID]
}>()
</script>

<template>
  <aside
    v-if="open"
    data-rig-sidebar
    aria-label="Sidebar"
    tabindex="-1"
    :data-state="open ? 'open' : 'closed'"
    @keydown.escape="$emit('update:open', false)"
    :style="{ width: width + 'px' }"
  >
    <div data-rig-sidebar-header>
      <slot name="header" />
    </div>
    <div data-rig-sidebar-content>
      <slot :activeViewId="activeViewId" />
    </div>
  </aside>
</template>
