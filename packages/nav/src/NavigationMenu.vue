<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface NavMenuItem {
  /** Unique identifier */
  id: string | number
  /** Display label */
  label: string
  /** URL for link items */
  href?: string
  /** Sub-menu items */
  children?: NavMenuItem[]
}

const props = withDefaults(
  defineProps<{
    /** Navigation menu items */
    items?: NavMenuItem[]
    /** Accessible label for the navigation region */
    ariaLabel?: string
  }>(),
  {
    items: () => [],
    ariaLabel: 'Main navigation',
  },
)

const emit = defineEmits<{
  select: [item: NavMenuItem]
}>()

defineSlots<{
  item?: (props: { item: NavMenuItem; open: boolean; hasChildren: boolean }) => unknown
  'child-item'?: (props: { item: NavMenuItem; parent: NavMenuItem }) => unknown
}>()

const navRef = ref<HTMLElement | null>(null)
const openId = ref<string | number | null>(null)
const focusedIndex = ref(0)
const focusedChildIndex = ref(0)

function toggle(item: NavMenuItem) {
  if (openId.value === item.id) {
    openId.value = null
  } else if (item.children?.length) {
    openId.value = item.id
    focusedChildIndex.value = 0
  }
}

function onSelect(item: NavMenuItem) {
  emit('select', item)
  openId.value = null
}

function onMenubarKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value + 1) % props.items.length
      openId.value = null
      break
    case 'ArrowLeft':
      e.preventDefault()
      focusedIndex.value = (focusedIndex.value - 1 + props.items.length) % props.items.length
      openId.value = null
      break
    case 'ArrowDown': {
      e.preventDefault()
      const current = props.items[focusedIndex.value]
      if (current?.children?.length) {
        openId.value = current.id
        focusedChildIndex.value = 0
      }
      break
    }
    case 'Escape':
      e.preventDefault()
      openId.value = null
      break
    case 'Enter':
    case ' ': {
      e.preventDefault()
      const item = props.items[focusedIndex.value]
      if (item?.children?.length) {
        toggle(item)
      } else if (item) {
        onSelect(item)
      }
      break
    }
  }
}

function onSubmenuKeydown(e: KeyboardEvent, parent: NavMenuItem) {
  const children = parent.children ?? []
  if (children.length === 0) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      e.stopPropagation()
      focusedChildIndex.value = (focusedChildIndex.value + 1) % children.length
      break
    case 'ArrowUp':
      e.preventDefault()
      e.stopPropagation()
      focusedChildIndex.value = (focusedChildIndex.value - 1 + children.length) % children.length
      break
    case 'Escape':
      e.preventDefault()
      e.stopPropagation()
      openId.value = null
      break
    case 'Enter':
    case ' ': {
      e.preventDefault()
      e.stopPropagation()
      const child = children[focusedChildIndex.value]
      if (child) onSelect(child)
      break
    }
  }
}

function onClickOutside(e: MouseEvent) {
  if (navRef.value && !navRef.value.contains(e.target as Node)) {
    openId.value = null
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
  <nav ref="navRef" data-rig-nav-menu role="navigation" :aria-label="ariaLabel">
    <ul role="menubar" @keydown="onMenubarKeydown">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        data-rig-nav-menu-item
        :data-state="openId === item.id ? 'open' : 'closed'"
        role="none"
      >
        <a
          v-if="item.href && !item.children?.length"
          data-rig-nav-menu-link
          :data-active="focusedIndex === index || undefined"
          :href="item.href"
          role="menuitem"
          :tabindex="focusedIndex === index ? 0 : -1"
          @focus="focusedIndex = index"
          @click="onSelect(item)"
        >
          <slot name="item" :item="item" :open="false" :has-children="false">
            {{ item.label }}
          </slot>
        </a>
        <button
          v-else-if="item.children?.length"
          data-rig-nav-menu-trigger
          :data-active="focusedIndex === index || undefined"
          role="menuitem"
          :aria-haspopup="true"
          :aria-expanded="openId === item.id"
          :tabindex="focusedIndex === index ? 0 : -1"
          @focus="focusedIndex = index"
          @click="toggle(item)"
        >
          <slot name="item" :item="item" :open="openId === item.id" :has-children="true">
            {{ item.label }}
          </slot>
        </button>
        <button
          v-else
          data-rig-nav-menu-trigger
          :data-active="focusedIndex === index || undefined"
          role="menuitem"
          :tabindex="focusedIndex === index ? 0 : -1"
          @focus="focusedIndex = index"
          @click="onSelect(item)"
        >
          <slot name="item" :item="item" :open="false" :has-children="false">
            {{ item.label }}
          </slot>
        </button>

        <ul
          v-if="item.children?.length && openId === item.id"
          data-rig-nav-menu-content
          role="menu"
          :aria-label="item.label"
          @keydown="onSubmenuKeydown($event, item)"
        >
          <li v-for="(child, childIndex) in item.children" :key="child.id" role="none">
            <a
              v-if="child.href"
              data-rig-nav-menu-link
              :data-active="focusedChildIndex === childIndex || undefined"
              :href="child.href"
              role="menuitem"
              :tabindex="focusedChildIndex === childIndex ? 0 : -1"
              @focus="focusedChildIndex = childIndex"
              @click="onSelect(child)"
            >
              <slot name="child-item" :item="child" :parent="item">
                {{ child.label }}
              </slot>
            </a>
            <button
              v-else
              data-rig-nav-menu-link
              :data-active="focusedChildIndex === childIndex || undefined"
              role="menuitem"
              :tabindex="focusedChildIndex === childIndex ? 0 : -1"
              @focus="focusedChildIndex = childIndex"
              @click="onSelect(child)"
            >
              <slot name="child-item" :item="child" :parent="item">
                {{ child.label }}
              </slot>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
