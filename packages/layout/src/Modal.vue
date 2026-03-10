<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

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

const dialogRef = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

function close() {
  emit('update:open', false)
}

function onOverlayClick(e: MouseEvent) {
  if (!props.persistent && e.target === e.currentTarget) {
    close()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
    return
  }

  // Focus trap
  if (e.key === 'Tab' && dialogRef.value) {
    const focusable = dialogRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previousFocus = document.activeElement as HTMLElement
      await nextTick()
      // Focus first focusable element
      const first = dialogRef.value?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      first?.focus()
    } else {
      previousFocus?.focus()
      previousFocus = null
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-show="open"
      data-rig-modal-overlay
      :data-state="open ? 'open' : 'closed'"
      @click="onOverlayClick"
      @keydown="onKeydown"
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
