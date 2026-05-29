<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Whether the divider stretches horizontally (default) or vertically */
    vertical?: boolean
    /** Optional label placed in the center of the divider */
    label?: string
  }>(),
  { vertical: false },
)

defineSlots<{
  default(props: Record<string, never>): unknown
}>()
</script>

<template>
  <div
    data-rig-divider
    :data-vertical="vertical || undefined"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <span v-if="label || $slots.default" data-rig-divider-label>
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>
