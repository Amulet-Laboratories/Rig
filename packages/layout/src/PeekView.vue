<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Whether the peek view is visible */
    open?: boolean
    /** Optional title shown in the header */
    title?: string
  }>(),
  {
    open: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

defineSlots<{
  header?: (props: { close: () => void }) => unknown
  default?: (props: Record<string, never>) => unknown
}>()

const contentRef = ref<HTMLElement | null>(null)

function close() {
  emit('update:open', false)
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      const first = contentRef.value?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      first?.focus()
    }
  },
)
</script>

<template>
  <div
    v-show="open"
    data-rig-peek-view
    role="dialog"
    :aria-label="title || 'Peek view'"
    :data-state="open ? 'open' : 'closed'"
    @keydown.escape="close"
  >
    <div data-rig-peek-view-header>
      <slot name="header" :close="close">
        <span v-if="title" data-rig-peek-view-title>{{ title }}</span>
      </slot>
      <button data-rig-peek-view-close aria-label="Close peek view" type="button" @click="close" />
    </div>

    <div ref="contentRef" data-rig-peek-view-content>
      <slot />
    </div>
  </div>
</template>
