<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Title text shown in the popconfirm */
    title?: string
    /** Label for the confirm button */
    confirmLabel?: string
    /** Label for the cancel button */
    cancelLabel?: string
    /** Whether the popconfirm is open */
    open?: boolean
  }>(),
  {
    title: 'Are you sure?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    open: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

defineSlots<{
  trigger?: (props: { open: boolean; toggle: () => void }) => unknown
  default?: (props: Record<string, never>) => unknown
  'confirm-icon'?: (props: Record<string, never>) => unknown
}>()

const popconfirmRef = ref<HTMLElement | null>(null)
const confirmBtnRef = ref<HTMLButtonElement | null>(null)

const isOpen = computed(() => props.open)

function toggle() {
  emit('update:open', !isOpen.value)
}

function onConfirm() {
  emit('confirm')
  emit('update:open', false)
}

function onCancel() {
  emit('cancel')
  emit('update:open', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    onCancel()
  }
}

function onClickOutside(e: MouseEvent) {
  if (isOpen.value && popconfirmRef.value && !popconfirmRef.value.contains(e.target as Node)) {
    onCancel()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>

<template>
  <div
    ref="popconfirmRef"
    data-rig-popconfirm
    :data-state="isOpen ? 'open' : 'closed'"
    @keydown="onKeydown"
  >
    <div data-rig-popconfirm-trigger @click="toggle">
      <slot name="trigger" :open="isOpen" :toggle="toggle" />
    </div>

    <div
      v-if="isOpen"
      data-rig-popconfirm-content
      role="alertdialog"
      :aria-label="title"
      aria-modal="true"
    >
      <div data-rig-popconfirm-title>{{ title }}</div>

      <div v-if="$slots.default" data-rig-popconfirm-description>
        <slot />
      </div>

      <div data-rig-popconfirm-actions>
        <button data-rig-popconfirm-cancel @click="onCancel">
          {{ cancelLabel }}
        </button>
        <button ref="confirmBtnRef" data-rig-popconfirm-confirm @click="onConfirm">
          <slot name="confirm-icon" />
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
