<script setup lang="ts">
import type { Size } from '../types'

const props = withDefaults(
  defineProps<{
    /** Display name — used to derive initials and default color */
    name?: string
    /** Size scale */
    size?: Size
    /** Explicit background color — derived from name hash if omitted */
    color?: string
    /** Online presence indicator */
    status?: 'online' | 'away' | 'dnd' | 'offline' | null
    /** Optional icon override (replaces initials) */
    icon?: string
    /** Image source — when set, shows image instead of initials */
    src?: string
  }>(),
  {
    name: '',
    size: 'md',
    status: null,
  },
)

defineSlots<{
  default(props: Record<string, never>): unknown
}>()

/** Extract first letter of first and last word. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]![0]?.toUpperCase() ?? '?'
  return `${parts[0]![0]?.toUpperCase() ?? ''}${parts[parts.length - 1]![0]?.toUpperCase() ?? ''}`
}

/** Deterministic color from name hash — returns an HSL string. */
function hashColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 45%, 45%)`
}

const initials = getInitials(props.name)
const backgroundColor = props.color ?? hashColor(props.name)
</script>

<template>
  <span
    data-rig-avatar
    tabindex="-1"
    :data-size="size"
    :data-status="status"
    :style="{ '--avatar-bg': backgroundColor }"
    :aria-label="name"
    role="img"
    @keydown.stop
  >
    <img v-if="src" :src="src" :alt="name" data-rig-avatar-img />
    <slot v-else>
      <span data-rig-avatar-initials>{{ initials }}</span>
    </slot>
    <span v-if="status" data-rig-avatar-status :data-status="status" />
  </span>
</template>
