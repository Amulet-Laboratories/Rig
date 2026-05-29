<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    /** Visual variant */
    variant?: 'info' | 'success' | 'warning' | 'error'
    /** Alert title */
    title?: string
    /** Whether the alert can be dismissed */
    dismissible?: boolean
    /** Icon name (rendered via slot) */
    icon?: string
  }>(),
  {
    variant: 'info',
    dismissible: false,
  },
)

const emit = defineEmits<{
  dismiss: []
}>()

defineSlots<{
  icon?: (props: { variant: string }) => unknown
  default?: (props: Record<string, never>) => unknown
  action?: (props: Record<string, never>) => unknown
}>()

const dismissed = ref(false)

function onDismiss() {
  dismissed.value = true
  emit('dismiss')
}
</script>

<template>
  <div
    v-if="!dismissed"
    data-rig-alert
    :data-variant="variant"
    role="alert"
    :aria-live="variant === 'error' ? 'assertive' : 'polite'"
  >
    <div v-if="$slots.icon || icon" data-rig-alert-icon aria-hidden="true">
      <slot name="icon" :variant="variant" />
    </div>
    <div data-rig-alert-content>
      <div v-if="title" data-rig-alert-title>{{ title }}</div>
      <div v-if="$slots.default" data-rig-alert-description>
        <slot />
      </div>
    </div>
    <div v-if="$slots.action" data-rig-alert-action>
      <slot name="action" />
    </div>
    <button v-if="dismissible" data-rig-alert-dismiss aria-label="Dismiss" @click="onDismiss">
      &times;
    </button>
  </div>
</template>
