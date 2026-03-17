<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import type { Placement } from '@floating-ui/vue'
import type { Action } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Whether the menu is open */
    open?: boolean
    /** Menu items */
    items: Action[]
    /** Preferred placement relative to the trigger */
    placement?: Placement
  }>(),
  {
    open: false,
    placement: 'bottom-start',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [action: Action]
}>()

defineSlots<{
  trigger?: (props: {
    open: boolean
    toggle: () => void
    triggerProps: { 'aria-haspopup': 'menu'; 'aria-expanded': boolean }
  }) => unknown
  item?: (props: { item: Action }) => unknown
}>()

const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)

const placementComputed = computed(() => props.placement)

const { floatingStyles } = useFloating(triggerRef, menuRef, {
  placement: placementComputed,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [offset(4), flip(), shift({ padding: 8 })],
})

function close() {
  emit('update:open', false)
}

function toggle() {
  emit('update:open', !props.open)
}

function selectItem(action: Action) {
  if (!action.disabled) {
    emit('select', action)
    close()
  }
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault()
      // Skip over disabled items
      for (let i = focusedIndex.value + 1; i < props.items.length; i++) {
        if (!props.items[i]!.disabled) {
          focusedIndex.value = i
          break
        }
      }
      break
    }
    case 'ArrowUp': {
      e.preventDefault()
      for (let i = focusedIndex.value - 1; i >= 0; i--) {
        if (!props.items[i]!.disabled) {
          focusedIndex.value = i
          break
        }
      }
      break
    }
    case 'Enter':
    case ' ':
      e.preventDefault()
      selectItem(props.items[focusedIndex.value]!)
      break
    case 'Escape':
      e.preventDefault()
      close()
      triggerRef.value?.focus()
      break
    case 'Tab':
      close()
      break
  }
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('update:open', true)
  }
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (triggerRef.value?.contains(target) || menuRef.value?.contains(target)) return
  close()
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      // Register listener only while open
      document.addEventListener('click', onClickOutside, true)
      // Start focus on first non-disabled item, not the container
      const firstEnabled = props.items.findIndex((i) => !i.disabled)
      focusedIndex.value = firstEnabled >= 0 ? firstEnabled : 0
      await nextTick()
      const firstBtn = menuRef.value?.querySelector<HTMLButtonElement>(
        '[role="menuitem"]:not([disabled])',
      )
      firstBtn?.focus()
    } else {
      document.removeEventListener('click', onClickOutside, true)
    }
  },
)
// Ensure cleanup if component is destroyed while open
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
</script>

<template>
  <div data-rig-dropdown :data-state="open ? 'open' : 'closed'">
    <div ref="triggerRef" data-rig-dropdown-trigger @click="toggle" @keydown="onTriggerKeydown">
      <slot
        name="trigger"
        :open="open"
        :toggle="toggle"
        :triggerProps="{ 'aria-haspopup': 'menu' as const, 'aria-expanded': open }"
      />
    </div>

    <Teleport to="body">
      <div
        v-show="open"
        ref="menuRef"
        data-rig-dropdown-menu
        role="menu"
        tabindex="-1"
        :data-state="open ? 'open' : 'closed'"
        :aria-hidden="!open || undefined"
        :inert="!open || undefined"
        :style="{ ...floatingStyles, zIndex: 'var(--rig-dropdown-z, 9000)' }"
        @keydown="onKeydown"
      >
        <button
          v-for="(item, index) in items"
          :key="item.id"
          data-rig-dropdown-item
          role="menuitem"
          :data-disabled="item.disabled || undefined"
          :data-state="focusedIndex === index ? 'highlighted' : undefined"
          :disabled="item.disabled"
          :tabindex="index === focusedIndex ? 0 : -1"
          @click="selectItem(item)"
          @mouseenter="focusedIndex = index"
        >
          <slot name="item" :item="item">
            <span data-rig-dropdown-item-label>{{ item.label }}</span>
            <span v-if="item.keybinding" data-rig-dropdown-item-keybinding>
              {{ item.keybinding }}
            </span>
          </slot>
        </button>
      </div>
    </Teleport>
  </div>
</template>
