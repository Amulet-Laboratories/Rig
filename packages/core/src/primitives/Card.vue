<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '../types'

const props = withDefaults(
  defineProps<{
    /** Visual variant — consumer defines meaning via CSS */
    variant?: string
    /** Size scale */
    size?: Size
    /** Whether the card is clickable/interactive */
    interactive?: boolean
    /** Accent color — applied as a CSS custom property (draws a left accent bar) */
    accent?: string
    /** Persistent highlighted/featured state, distinct from :hover */
    selected?: boolean
    /** Body layout — 'row' lays direct children out as a horizontal grid */
    layout?: 'stack' | 'row'
    /** grid-template-columns for row layout, e.g. '1fr auto auto' */
    columns?: string
  }>(),
  {
    size: 'md',
    layout: 'stack',
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()

defineSlots<{
  'header'?(props: Record<string, never>): unknown
  default?(props: Record<string, never>): unknown
  'footer'?(props: Record<string, never>): unknown
}>()

// Merge the two CSS custom properties a card can set into one inline style,
// omitting the object entirely when neither is present (keeps the DOM clean and
// preserves hex's `[style*='--rig-card-accent']` accent selector).
const cardStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.accent) style['--rig-card-accent'] = props.accent
  if (props.columns) style['--rig-card-columns'] = props.columns
  return Object.keys(style).length ? style : undefined
})
</script>

<template>
  <component
    :is="interactive ? 'button' : 'div'"
    data-rig-card
    tabindex="-1"
    :role="interactive ? undefined : 'article'"
    :data-variant="variant"
    :data-size="size"
    :data-interactive="interactive || undefined"
    :data-selected="selected || undefined"
    :data-layout="layout === 'row' ? 'row' : undefined"
    :style="cardStyle"
    :type="interactive ? 'button' : undefined"
    @keydown.enter="$emit('click', $event)"
    @click="interactive ? $emit('click', $event) : undefined"
  >
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </component>
</template>
