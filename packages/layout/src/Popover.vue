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
    /** Accessible label for the popover content (required when role="dialog") */
    ariaLabel?: string
    /** ID of the element that labels the popover content */
    ariaLabelledBy?: string
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

defineSlots<{
  trigger: (props: { open: boolean; toggle: () => void }) => unknown
  default: (props: Record<string, never>) => unknown
}>()

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const placementComputed = computed(() => props.placement)

// Lazy middleware — only allocate the array once, on first access
let _middleware: ReturnType<typeof offset | typeof flip | typeof shift>[] | undefined
function getMiddleware() {
  if (!_middleware) _middleware = [offset(8), flip(), shift({ padding: 8 })]
  return _middleware
}

const { floatingStyles, placement: computedPlacement } = useFloating(triggerRef, contentRef, {
  placement: placementComputed,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: computed(getMiddleware),
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
    if (typeof document === 'undefined') return
    if (isOpen) {
      document.addEventListener('click', onClickOutside, true)
      await nextTick()
      contentRef.value?.focus()
    } else {
      document.removeEventListener('click', onClickOutside, true)
    }
  },
)
onUnmounted(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('click', onClickOutside, true)
})
</script>

<template>
  <div data-rig-popover :data-state="open ? 'open' : 'closed'">
    <div ref="triggerRef" data-rig-popover-trigger>
      <slot name="trigger" :open="open" :toggle="toggle" />
    </div>

    <Teleport to="body">
      <div
        v-show="open"
        ref="contentRef"
        data-rig-popover-content
        :role="ariaLabel || ariaLabelledBy ? 'dialog' : undefined"
        :data-state="open ? 'open' : 'closed'"
        :data-side="computedPlacement"
        :aria-label="ariaLabel || undefined"
        :aria-labelledby="ariaLabelledBy || undefined"
        :aria-hidden="!open || undefined"
        :inert="!open || undefined"
        tabindex="-1"
        :style="{ ...floatingStyles, zIndex: 'var(--rig-popover-z, 9000)' }"
        @keydown="onKeydown"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>
