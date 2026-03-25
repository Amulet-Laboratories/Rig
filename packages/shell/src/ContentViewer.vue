<!--
  ContentViewer — Generic document/record viewer for the IdeShell editor area.
  Provides breadcrumbs + header + scrollable body with slots for all sections.
-->
<script setup lang="ts">
import { Button } from '@core/primitives'
import { Breadcrumbs, type BreadcrumbItem } from '@nav/index'

defineProps<{
  /** Breadcrumb path segments */
  breadcrumbs?: BreadcrumbItem[]
  /** Whether to show the edit button */
  editable?: boolean
  /** Label for the edit button */
  editLabel?: string
}>()

const emit = defineEmits<{
  edit: []
}>()

defineSlots<{
  /** Header area — title, badges, metadata */
  header?: (props: Record<string, never>) => unknown
  /** Main body content */
  default?: (props: Record<string, never>) => unknown
  /** Custom edit area — replaces default view when in edit mode */
  editor?: (props: Record<string, never>) => unknown
  /** Empty state when no content */
  empty?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div data-rig-content-viewer>
    <!-- Editor mode -->
    <slot v-if="$slots.editor" name="editor" />

    <!-- View mode -->
    <template v-else>
      <Breadcrumbs
        v-if="breadcrumbs?.length"
        :items="breadcrumbs"
        data-rig-content-viewer-breadcrumbs
      />

      <div data-rig-content-viewer-scroll>
        <slot v-if="$slots.header || editable" name="header">
          <div data-rig-content-viewer-header>
            <Button v-if="editable" variant="ghost" size="sm" @click="emit('edit')">
              {{ editLabel ?? 'Edit' }}
            </Button>
          </div>
        </slot>

        <div data-rig-content-viewer-body>
          <slot>
            <slot name="empty">
              <div data-rig-content-viewer-empty>No content</div>
            </slot>
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>
