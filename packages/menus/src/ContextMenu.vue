<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useFloating, shift, offset, autoUpdate } from '@floating-ui/vue'
import type { Action } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Whether the menu is open */
    open?: boolean
    /** X position from contextmenu event */
    x: number
    /** Y position from contextmenu event */
    y: number
    /** Menu items */
    items: Action[]
  }>(),
  {
    open: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [action: Action]
}>()

defineSlots<{
  item: (props: { item: Action }) => unknown
}>()

// Singleton: only one context menu can be open at a time.
// Each instance broadcasts its id when it opens; others close themselves.
let _nextId = 0
const instanceId = ++_nextId
const OPEN_EVENT = 'rig:context-menu-open'

const menuRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)

// Virtual element representing the right-click point
const virtualEl = computed(() => ({
  getBoundingClientRect: () => new DOMRect(props.x, props.y, 0, 0),
}))

const { floatingStyles } = useFloating(virtualEl, menuRef, {
  strategy: 'fixed',
  placement: 'bottom-start',
  whileElementsMounted: autoUpdate,
  middleware: [offset(4), shift({ padding: 8, crossAxis: true })],
})

function close() {
  emit('update:open', false)
}

function selectItem(action: Action) {
  if (!action.disabled) {
    emit('select', action)
    close()
  }
}

function findNextEnabled(from: number, direction: 1 | -1): number {
  let idx = from + direction
  while (idx >= 0 && idx < props.items.length) {
    if (!props.items[idx]!.disabled && !props.items[idx]!.separator) return idx
    idx += direction
  }
  return from
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = findNextEnabled(focusedIndex.value, 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = findNextEnabled(focusedIndex.value, -1)
      break
    case 'Enter':
      e.preventDefault()
      selectItem(props.items[focusedIndex.value]!)
      break
    case 'Escape':
      e.preventDefault()
      close()
      break
  }
}

function onClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    close()
  }
}

function onContextMenuOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    close()
  }
}

function onOtherMenuOpened(e: Event) {
  if ((e as CustomEvent<{ id?: number }>).detail?.id !== instanceId) {
    close()
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      // Tell every other open instance to close
      document.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { id: instanceId } }))
      focusedIndex.value = 0
      nextTick(() => menuRef.value?.focus())
      document.addEventListener('click', onClickOutside, true)
      document.addEventListener('contextmenu', onContextMenuOutside, true)
      document.addEventListener(OPEN_EVENT, onOtherMenuOpened)
    } else {
      document.removeEventListener('click', onClickOutside, true)
      document.removeEventListener('contextmenu', onContextMenuOutside, true)
      document.removeEventListener(OPEN_EVENT, onOtherMenuOpened)
    }
  },
)

onUnmounted(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('contextmenu', onContextMenuOutside, true)
  document.removeEventListener(OPEN_EVENT, onOtherMenuOpened)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="open"
      ref="menuRef"
      data-rig-context-menu
      role="menu"
      tabindex="-1"
      :data-state="open ? 'open' : 'closed'"
      :aria-hidden="!open || undefined"
      :inert="!open || undefined"
      :style="{ ...floatingStyles, zIndex: 'var(--rig-context-menu-z, 9999)' }"
      @keydown="onKeydown"
    >
      <template v-for="(item, index) in items" :key="item.id">
        <hr v-if="item.separator" data-rig-context-menu-separator role="separator" />
        <button
          v-else
          data-rig-context-menu-item
          role="menuitem"
          :data-disabled="item.disabled || undefined"
          :data-highlighted="focusedIndex === index || undefined"
          :disabled="item.disabled"
          :tabindex="index === focusedIndex ? 0 : -1"
          @click="selectItem(item)"
        >
          <slot name="item" :item="item">
            <span data-rig-context-menu-label>{{ item.label }}</span>
            <span v-if="item.keybinding" data-rig-context-menu-keybinding>
              {{ item.keybinding }}
            </span>
          </slot>
        </button>
      </template>
    </div>
  </Teleport>
</template>
