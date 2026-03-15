<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '../types'

export interface AvatarItem {
  src?: string
  name: string
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Array of avatar data */
    avatars?: AvatarItem[]
    /** Maximum visible avatars before +N indicator */
    max?: number
    /** Size of each avatar */
    size?: Size
  }>(),
  {
    avatars: () => [],
    max: 5,
    size: 'md',
  },
)

const visible = computed(() => props.avatars.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.avatars.length - props.max))

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <div
    data-rig-avatar-group
    :data-size="size"
    role="group"
    :aria-label="`${avatars.length} members`"
    tabindex="0"
    @keydown.stop
  >
    <div
      v-for="(avatar, i) in visible"
      :key="i"
      data-rig-avatar-group-item
      :title="avatar.name"
      :style="avatar.color ? { '--avatar-color': avatar.color } : undefined"
    >
      <img v-if="avatar.src" :src="avatar.src" :alt="avatar.name" data-rig-avatar-group-img />
      <span v-else data-rig-avatar-group-initials>{{ initials(avatar.name) }}</span>
    </div>
    <div v-if="overflow > 0" data-rig-avatar-group-overflow :title="`${overflow} more`">
      +{{ overflow }}
    </div>
  </div>
</template>
