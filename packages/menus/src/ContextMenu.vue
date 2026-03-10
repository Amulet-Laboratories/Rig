<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useFloating, flip, shift, offset } from '@floating-ui/vue'
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

const menuRef = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)

// Virtual element representing the right-click point
const virtualEl = computed(() => ({
  getBoundingClientRect: () => new DOMRect(props.x, props.y, 0, 0),
}))

const { floatingStyles } = useFloating(virtualEl, menuRef, {
  strategy: 'fixed',
  placement: 'bottom-start',
  middleware: [offset(2), flip(), shift({ padding: 8 })],
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

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, props.items.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      selectItem(props.items[focusedIndex.value])
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

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      focusedIndex.value = 0
      nextTick(() => menuRef.value?.focus())
    }
  },
)

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside, true)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="menuRef"
      data-rig-context-menu
      role="menu"
      tabindex="-1"
      :style="{ ...floatingStyles, zIndex: 'var(--rig-context-menu-z, 9999)' }"
      @keydown="onKeydown"
    >
      <button
        v-for="(item, index) in items"
        :key="item.id"
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
    </div>
  </Teleport>
</template>
