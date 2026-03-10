<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Bound on/off state */
    modelValue?: boolean
    /** Whether the switch is disabled */
    disabled?: boolean
  }>(),
  {
    modelValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <button
    data-rig-switch
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :data-state="modelValue ? 'checked' : 'unchecked'"
    :data-disabled="disabled || undefined"
    :disabled="disabled"
    @click="toggle"
    @keydown="onKeydown"
  >
    <span data-rig-switch-track>
      <span data-rig-switch-thumb />
    </span>
    <slot />
  </button>
</template>
