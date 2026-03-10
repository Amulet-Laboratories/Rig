<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import type { Action } from '@core/types'

export interface MenubarEntry {
  id: string
  label: string
  items: Action[]
}

const props = defineProps<{
  /** Top-level menu entries */
  items: MenubarEntry[]
}>()

const emit = defineEmits<{
  select: [action: Action]
}>()

const openIndex = ref(-1)
const focusedIndex = ref(0)
const triggerRefs = ref<(HTMLElement | null)[]>([])
const menuRefs = ref<(HTMLElement | null)[]>([])
const menuFocusedIndex = ref(0)

function setTriggerRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) triggerRefs.value[index] = el
  else triggerRefs.value[index] = null
}

function setMenuRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) menuRefs.value[index] = el
  else menuRefs.value[index] = null
}

async function openMenu(index: number) {
  openIndex.value = index
  focusedIndex.value = index
  menuFocusedIndex.value = 0
  // Wait for v-show to flush before querying items
  await nextTick()
  const items = getMenuItems(index)
  items[0]?.focus()
}

function closeMenu() {
  const prev = openIndex.value
  openIndex.value = -1
  triggerRefs.value[prev]?.focus()
}

function toggleMenu(index: number) {
  if (openIndex.value === index) {
    closeMenu()
  } else {
    openMenu(index)
  }
}

function getMenuItems(index: number): HTMLElement[] {
  return Array.from(
    menuRefs.value[index]?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [],
  )
}

function selectItem(action: Action, entryIndex: number) {
  if (action.disabled) return
  emit('select', action)
  openIndex.value = -1
  triggerRefs.value[entryIndex]?.focus()
}

/** Keyboard handler for the trigger bar (no menu open). */
function onBarKeydown(e: KeyboardEvent) {
  const len = props.items.length
  if (!len) return

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value + 1) % len
      if (openIndex.value !== -1) {
        openMenu(focusedIndex.value)
      } else {
        triggerRefs.value[focusedIndex.value]?.focus()
      }
      break
    case 'ArrowLeft':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value - 1 + len) % len
      if (openIndex.value !== -1) {
        openMenu(focusedIndex.value)
      } else {
        triggerRefs.value[focusedIndex.value]?.focus()
      }
      break
    case 'Escape':
      if (openIndex.value !== -1) {
        e.preventDefault()
        closeMenu()
      }
      break
  }
}

/** Keyboard handler for an open menu. */
function onMenuKeydown(e: KeyboardEvent, index: number) {
  const items = getMenuItems(index)

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      menuFocusedIndex.value = Math.min(menuFocusedIndex.value + 1, items.length - 1)
      items[menuFocusedIndex.value]?.focus()
      break
    case 'ArrowUp':
      e.preventDefault()
      menuFocusedIndex.value = Math.max(menuFocusedIndex.value - 1, 0)
      items[menuFocusedIndex.value]?.focus()
      break
    case 'ArrowRight': {
      e.preventDefault()
      e.stopPropagation()
      const next = (index + 1) % props.items.length
      openMenu(next)
      break
    }
    case 'ArrowLeft': {
      e.preventDefault()
      e.stopPropagation()
      const prev = (index - 1 + props.items.length) % props.items.length
      openMenu(prev)
      break
    }
    case 'Escape':
      e.preventDefault()
      closeMenu()
      break
    case 'Tab':
      closeMenu()
      break
  }
}

/** Close menus on outside click. */
function onClickOutside(e: MouseEvent) {
  const target = e.target as Node
  const inTrigger = triggerRefs.value.some((el) => el?.contains(target))
  const inMenu = menuRefs.value.some((el) => el?.contains(target))
  if (!inTrigger && !inMenu) {
    openIndex.value = -1
  }
}

// Register the outside-click listener only while a menu is open
watch(openIndex, (idx) => {
  if (idx !== -1) {
    document.addEventListener('click', onClickOutside, true)
  } else {
    document.removeEventListener('click', onClickOutside, true)
  }
})
onUnmounted(() => document.removeEventListener('click', onClickOutside, true))
</script>

<template>
  <div
    data-rig-menubar
    role="menubar"
    @keydown="onBarKeydown"
  >
    <div
      v-for="(entry, index) in items"
      :key="entry.id"
      data-rig-menubar-entry
      :data-state="openIndex === index ? 'open' : 'closed'"
    >
      <!-- Trigger button -->
      <button
        :ref="(el) => setTriggerRef(el, index)"
        data-rig-menubar-trigger
        role="menuitem"
        :aria-haspopup="true"
        :aria-expanded="openIndex === index"
        :tabindex="focusedIndex === index ? 0 : -1"
        @click="toggleMenu(index)"
        @keydown.down.prevent="openMenu(index)"
        @keydown.enter.prevent="openMenu(index)"
        @keydown.space.prevent="openMenu(index)"
        @focus="focusedIndex = index"
      >
        <slot name="trigger" :entry="entry" :open="openIndex === index">
          {{ entry.label }}
        </slot>
      </button>

      <!-- Dropdown menu -->
      <div
        v-show="openIndex === index"
        :ref="(el) => setMenuRef(el, index)"
        data-rig-menubar-content
        role="menu"
        :data-state="openIndex === index ? 'open' : 'closed'"
        @keydown="onMenuKeydown($event, index)"
      >
        <button
          v-for="item in entry.items"
          :key="item.id"
          data-rig-menubar-item
          role="menuitem"
          :data-disabled="item.disabled || undefined"
          :disabled="item.disabled"
          @click="selectItem(item, index)"
        >
          <slot name="item" :item="item">
            <span data-rig-menubar-item-label>{{ item.label }}</span>
            <span v-if="item.keybinding" data-rig-menubar-item-keybinding>
              {{ item.keybinding }}
            </span>
          </slot>
        </button>
      </div>
    </div>
  </div>
</template>
