<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import type { Placement } from '@floating-ui/vue'

const props = withDefaults(
  defineProps<{
    /** Whether the popover is open */
    open?: boolean
    /** Preferred placement relative to the trigger */
    placement?: Placement
    /** Prevent closing on click-outside */
    persistent?: boolean
  }>(),
  {
    open: false,
    placement: 'bottom',
    persistent: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const placementComputed = computed(() => props.placement)

const { floatingStyles, placement: computedPlacement } = useFloating(triggerRef, contentRef, {
  placement: placementComputed,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(8), flip(), shift({ padding: 8 })],
})

function close() {
  emit('update:open', false)
}

function toggle() {
  emit('update:open', !props.open)
}

function onClickOutside(e: MouseEvent) {
  if (props.persistent) return
  const target = e.target as Node
  if (triggerRef.value?.contains(target) || contentRef.value?.contains(target)) {
    return
  }
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    close()
    triggerRef.value?.focus()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      document.addEventListener('click', onClickOutside, true)
      await nextTick()
      contentRef.value?.focus()
    } else {
      document.removeEventListener('click', onClickOutside, true)
    }
  },
)
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
</script>

<template>
  <div data-rig-popover :data-state="open ? 'open' : 'closed'">
    <div ref="triggerRef" data-rig-popover-trigger :aria-expanded="open">
      <slot name="trigger" :open="open" :toggle="toggle" />
    </div>

    <Teleport to="body">
      <div
        v-show="open"
        ref="contentRef"
        data-rig-popover-content role="dialog"
        :data-state="open ? 'open' : 'closed'"
        :data-side="computedPlacement"
        tabindex="-1"
        :style="{ ...floatingStyles, zIndex: 'var(--rig-popover-z, 9000)' }"
        @keydown="onKeydown"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>
