<script setup lang="ts">
import type { ID } from '@core/types'

withDefaults(
  defineProps<{
    /** Whether the sidebar is visible */
    open?: boolean
    /** ID of the currently active view */
    activeViewId?: ID
    /** Sidebar width in pixels — when omitted the sidebar fills its container */
    width?: number
    /**
     * Convenience title rendered in the default header. Skipped when a
     * `#header` slot is provided — slot wins. Use a plain string for the
     * common case; reach for `#header` when you need actions or icons.
     */
    title?: string
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

defineSlots<{
  header?(props: Record<string, never>): unknown
  /** Inline content after the title — actions, badges, etc. Only rendered
   *  when `title` is set and `#header` is not. */
  'header-actions'?(props: Record<string, never>): unknown
  default?(props: { activeViewId: ID | undefined }): unknown
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
  >
    <div v-if="$slots.header" data-rig-sidebar-header>
      <slot name="header" />
    </div>
    <div v-else-if="title" data-rig-sidebar-header>
      <span data-rig-sidebar-title>{{ title }}</span>
      <slot name="header-actions" />
    </div>
    <div data-rig-sidebar-content>
      <slot :activeViewId="activeViewId" />
    </div>
  </aside>
</template>
