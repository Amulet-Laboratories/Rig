<script setup lang="ts">
import { ref } from 'vue'
import { useTooltip } from '@core/composables'
import type { Action, ID, Orientation } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Action items to display */
    items: Action[]
    /** Currently active item ID */
    activeId?: ID
    /** Bar orientation */
    orientation?: Orientation
  }>(),
  {
    orientation: 'vertical',
  },
)

const emit = defineEmits<{
  'update:activeId': [id: ID]
  select: [action: Action]
}>()

defineSlots<{
  item?: (props: { item: Action; active: boolean }) => unknown
  bottom?: (props: Record<string, never>) => unknown
}>()

const tooltip = useTooltip()
const focusedIndex = ref(0)
const itemRefs = ref<HTMLElement[]>([])

function setItemRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) {
    itemRefs.value[index] = el
  }
}

function onItemClick(action: Action) {
  emit('update:activeId', action.id)
  emit('select', action)
}

function onItemMouseEnter(e: MouseEvent, action: Action) {
  tooltip.show(
    e.currentTarget as HTMLElement,
    action.label,
    props.orientation === 'vertical' ? 'right' : 'bottom',
  )
}

function onItemMouseLeave() {
  tooltip.hide()
}

function onKeydown(e: KeyboardEvent) {
  const isVertical = props.orientation === 'vertical'
  const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
  const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

  if (e.key === nextKey) {
    e.preventDefault()
    focusedIndex.value = Math.min(focusedIndex.value + 1, props.items.length - 1)
    itemRefs.value[focusedIndex.value]?.focus()
  } else if (e.key === prevKey) {
    e.preventDefault()
    focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
    itemRefs.value[focusedIndex.value]?.focus()
  } else if (e.key === 'Home') {
    e.preventDefault()
    focusedIndex.value = 0
    itemRefs.value[0]?.focus()
  } else if (e.key === 'End') {
    e.preventDefault()
    focusedIndex.value = props.items.length - 1
    itemRefs.value[focusedIndex.value]?.focus()
  }
}
</script>

<template>
  <div
    data-rig-activity-bar
    :data-orientation="orientation"
    role="toolbar"
    :aria-orientation="orientation"
    aria-label="Activity bar"
    @keydown="onKeydown"
  >
    <div data-rig-activity-bar-top>
      <button
        v-for="(item, index) in items"
        :key="item.id"
        :ref="(el) => setItemRef(el, index)"
        data-rig-activity-bar-item
        :data-state="activeId === item.id ? 'active' : 'inactive'"
        :data-disabled="item.disabled || undefined"
        :disabled="item.disabled"
        :tabindex="index === focusedIndex ? 0 : -1"
        :aria-label="item.label"
        @click="onItemClick(item)"
        @mouseenter="(e) => onItemMouseEnter(e, item)"
        @mouseleave="onItemMouseLeave"
      >
        <slot name="item" :item="item" :active="activeId === item.id">
          {{ item.label }}
        </slot>
        <span
          v-if="item.badge != null && item.badge !== ''"
          data-rig-activity-bar-badge
          :aria-label="`${item.badge} notifications`"
        >
          {{ item.badge }}
        </span>
      </button>
    </div>
    <div v-if="$slots.bottom" data-rig-activity-bar-bottom>
      <slot name="bottom" />
    </div>
  </div>
</template>
