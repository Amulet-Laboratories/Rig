<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Window/document title displayed in the center caption */
    title?: string
    /** Subtitle displayed after the title (e.g. project name) */
    subtitle?: string
    /** Whether the title bar is draggable for window movement (Electron/Tauri) */
    draggable?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    draggable: false,
  },
)

defineSlots<{
  /** Left section — app icon, menu bar, or navigation */
  leading?: (props: Record<string, never>) => unknown
  /** Center section — overrides default title/subtitle rendering */
  default?: (props: Record<string, never>) => unknown
  /** Right section — window controls, search, user avatar */
  trailing?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <header data-rig-titlebar :data-draggable="draggable || undefined" role="banner">
    <div data-rig-titlebar-leading>
      <slot name="leading" />
    </div>
    <div data-rig-titlebar-caption>
      <slot>
        <span v-if="title" data-rig-titlebar-title>{{ title }}</span>
        <span v-if="title && subtitle" data-rig-titlebar-separator> — </span>
        <span v-if="subtitle" data-rig-titlebar-subtitle>{{ subtitle }}</span>
      </slot>
    </div>
    <div data-rig-titlebar-trailing>
      <slot name="trailing" />
    </div>
  </header>
</template>
