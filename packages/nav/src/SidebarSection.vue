<script setup lang="ts">
// SidebarSection — labelled section inside a SideBar. Two modes:
//
//   1. Stats: pass `rows` (label/value pairs with optional tone color).
//      Use for "Counts" blocks ("Records: 27 · Issues: 0").
//
//   2. Custom content: omit `rows` and use the default slot for arbitrary
//      content (lists, alerts, progress bars).
//
// Both modes can coexist — rows render first, then slot content.

export type SidebarSectionTone =
  'muted' | 'foreground' | 'success' | 'warning' | 'info' | 'danger' | 'accent'

export interface SidebarSectionRow {
  label: string
  value: string | number
  tone?: SidebarSectionTone
}

withDefaults(
  defineProps<{
    /** Section heading. Optional — omit for an unlabelled spacer. */
    title?: string
    /** Tabular rows of label/value pairs. */
    rows?: SidebarSectionRow[]
    /** Top border separating this section from the previous one. */
    border?: boolean
  }>(),
  { border: true, rows: () => [] },
)

defineSlots<{
  /** Inline content after the title (e.g. a count badge). */
  'title-suffix'?(props: Record<string, never>): unknown
  /** Custom content rendered below the rows. */
  default?(props: Record<string, never>): unknown
}>()
</script>

<template>
  <div data-rig-sidebar-section :data-bordered="border || undefined">
    <div v-if="title" data-rig-sidebar-section-title>
      <span data-rig-sidebar-section-label>{{ title }}</span>
      <slot name="title-suffix" />
    </div>
    <div v-if="rows.length > 0" data-rig-sidebar-section-rows>
      <div
        v-for="row in rows"
        :key="row.label"
        data-rig-sidebar-row
        :data-tone="row.tone || undefined"
      >
        <span data-rig-sidebar-row-label>{{ row.label }}</span>
        <span data-rig-sidebar-row-value>{{ row.value }}</span>
      </div>
    </div>
    <slot />
  </div>
</template>
