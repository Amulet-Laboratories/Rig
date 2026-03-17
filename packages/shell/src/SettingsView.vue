<!--
  SettingsView — Generic settings panel for IdeShell.
  Provides a structured settings layout with sections and keyboard shortcut display.
-->
<script setup lang="ts">
import { Button } from '@core/primitives'

defineProps<{
  /** Settings panel title */
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

defineSlots<{
  /** Header area — overrides default title + close button */
  header?: (props: Record<string, never>) => unknown
  /** Settings sections */
  default?: (props: Record<string, never>) => unknown
  /** Footer / about section */
  footer?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div data-rig-settings-view>
    <!-- Header -->
    <div data-rig-settings-view-header>
      <slot name="header">
        <h1 data-rig-settings-view-title>{{ title ?? 'Settings' }}</h1>
        <Button variant="ghost" size="sm" @click="emit('close')">Close</Button>
      </slot>
    </div>

    <!-- Sections -->
    <div data-rig-settings-view-body>
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" data-rig-settings-view-footer>
      <slot name="footer" />
    </div>
  </div>
</template>
