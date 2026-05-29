<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useFocusTrap } from '@core/composables'

const props = withDefaults(
  defineProps<{
    /** Whether the drawer is open */
    open?: boolean
    /** Side the drawer slides in from */
    side?: 'left' | 'right' | 'top' | 'bottom'
    /** Prevent closing on overlay click */
    persistent?: boolean
    /** Accessible label */
    ariaLabel?: string
    /** ID of the element that labels the drawer */
    ariaLabelledBy?: string
  }>(),
  {
    open: false,
    side: 'right',
    persistent: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

defineSlots<{
  default(props: Record<string, never>): unknown
}>()

const drawerRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:open', false)
}

useFocusTrap({
  containerRef: drawerRef,
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
      data-rig-drawer-overlay
      :data-state="open ? 'open' : 'closed'"
      :data-side="side"
      :aria-hidden="!open || undefined"
      :inert="!open || undefined"
      @click="onOverlayClick"
    >
      <div
        ref="drawerRef"
        data-rig-drawer
        :data-side="side"
        :data-state="open ? 'open' : 'closed'"
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
