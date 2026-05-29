<script setup lang="ts">
import { useToast } from './useToast'

defineSlots<{
  toast: (props: {
    id: string
    message: string
    variant: 'info' | 'success' | 'warning' | 'error'
    dismissible: boolean
    dismiss: () => void
  }) => unknown
}>()

const { toasts, add, dismiss, clear } = useToast()

defineExpose({ toasts, add, dismiss, clear })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="toasts.length > 0"
      data-rig-toast-container
      tabindex="-1"
      role="log"
      aria-live="polite"
      aria-relevant="additions removals"
      @keydown.escape="clear()"
    >
      <div v-for="entry in toasts" :key="entry.id" data-rig-toast :data-variant="entry.variant">
        <slot
          :id="entry.id"
          name="toast"
          :message="entry.message"
          :variant="entry.variant"
          :dismissible="entry.dismissible"
          :dismiss="() => dismiss(entry.id)"
        >
          <span data-rig-toast-message>{{ entry.message }}</span>
          <button
            v-if="entry.dismissible"
            data-rig-toast-dismiss
            aria-label="Dismiss"
            @click="dismiss(entry.id)"
          >
            &times;
          </button>
        </slot>
      </div>
    </div>
  </Teleport>
</template>
