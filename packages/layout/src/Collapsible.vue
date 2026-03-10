<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Whether the collapsible is open */
    open?: boolean
    /** Prevent the user from toggling */
    disabled?: boolean
  }>(),
  {
    open: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:open', !props.open)
  }
}
</script>

<template>
  <div
    data-rig-collapsible
    :data-state="open ? 'open' : 'closed'"
    :data-disabled="disabled || undefined"
  >
    <slot name="trigger" :open="open" :toggle="toggle" />
    <div
      v-show="open"
      data-rig-collapsible-content
      :data-state="open ? 'open' : 'closed'"
    >
      <slot />
    </div>
  </div>
</template>
