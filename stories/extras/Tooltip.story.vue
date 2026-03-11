<script setup lang="ts">
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Tooltip from '@extras/Tooltip.vue'
import { useTooltip } from '@core/composables'

const { theme, themeOptions } = useHexTheme()

const tooltip = useTooltip()

function onEnter(e: MouseEvent) {
  tooltip.show(e.currentTarget as HTMLElement, 'Hello from Tooltip', 'bottom')
}

function onLeave() {
  tooltip.hide()
}
</script>

<template>
  <Story title="Extras / Tooltip" icon="lucide:message-square">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Hover to Show">
      <div style="padding: 48px; text-align: center">
        <button @mouseenter="onEnter" @mouseleave="onLeave">Hover me</button>
      </div>
      <Tooltip />
    </Variant>
  </Story>
</template>
