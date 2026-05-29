<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useFocusTrap } from '@core/composables'

const props = withDefaults(
  defineProps<{
    /** Whether the modal is open */
    open?: boolean
    /** Prevent closing on click-outside */
    persistent?: boolean
    /** Accessible label */
    ariaLabel?: string
    /** ID of the element that labels the modal */
    ariaLabelledBy?: string
  }>(),
  {
    open: false,
    persistent: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

defineSlots<{
  default(props: Record<string, never>): unknown
}>()

const dialogRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:open', false)
}

useFocusTrap({
  containerRef: dialogRef,
  active: toRef(props, 'open'),
  onEscape: close,
  scrollLock: true,
})

function onOverlayClick(e: MouseEvent) {
  if (!props.persistent && e.target === e.currentTarget) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-show="open"
      data-rig-modal-overlay
      :data-state="open ? 'open' : 'closed'"
      :aria-hidden="!open || undefined"
      :inert="!open || undefined"
      @click="onOverlayClick"
    >
      <div
        ref="dialogRef"
        data-rig-modal
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledBy"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
