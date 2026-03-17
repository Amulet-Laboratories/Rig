<script setup lang="ts">
import { ref } from 'vue'
import type { ID, Orientation } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Active tab ID */
    modelValue?: ID
    /** Tab axis */
    orientation?: Orientation
    /**
     * `automatic` — focusing a tab also activates it.
     * `manual` — keyboard focus moves independently; press Enter/Space to activate.
     */
    activationMode?: 'automatic' | 'manual'
  }>(),
  {
    orientation: 'horizontal',
    activationMode: 'automatic',
  },
)

/**
 * @emits update:modelValue
 */
const emit = defineEmits<{
  'update:modelValue': [value: ID]
}>()

defineSlots<{
  tabs?: (props: { isActive: (id: ID) => boolean; activate: (id: ID) => void }) => unknown
  default?: (props: { activeId: ID | undefined; isActive: (id: ID) => boolean }) => unknown
}>()

const tablistRef = ref<HTMLElement | null>(null)

function activate(id: ID) {
  emit('update:modelValue', id)
}

function isActive(id: ID): boolean {
  return props.modelValue === id
}

/** Navigate to the next/prev tab by querying [role="tab"] children. */
function onKeydown(e: KeyboardEvent) {
  const tabs = Array.from(tablistRef.value?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])
  if (!tabs.length) return

  const ci = tabs.indexOf(tablistRef.value?.querySelector<HTMLElement>(':focus') as HTMLElement)
  const isHoriz = props.orientation !== 'vertical'
  const prevKey = isHoriz ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = isHoriz ? 'ArrowRight' : 'ArrowDown'

  let next = ci
  if (e.key === prevKey) {
    e.preventDefault()
    next = ci > 0 ? ci - 1 : tabs.length - 1
  } else if (e.key === nextKey) {
    e.preventDefault()
    next = ci < tabs.length - 1 ? ci + 1 : 0
  } else if (e.key === 'Home') {
    e.preventDefault()
    next = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    next = tabs.length - 1
  } else if ((e.key === 'Enter' || e.key === ' ') && props.activationMode === 'manual') {
    e.preventDefault()
    const id = tabs[ci]?.getAttribute('data-tab-id')
    if (id) activate(id)
    return
  } else {
    return
  }

  tabs[next]?.focus()
  if (props.activationMode !== 'manual') {
    const id = tabs[next]?.getAttribute('data-tab-id')
    if (id) activate(id)
  }
}
</script>

<template>
  <div data-rig-tabs :data-orientation="orientation">
    <div
      ref="tablistRef"
      data-rig-tablist
      role="tablist"
      :aria-orientation="orientation"
      @keydown="onKeydown"
    >
      <!--
        Slot for tab triggers.
        Expose `isActive(id)` and `activate(id)` so consumers can build
        their own tab buttons using `data-rig-tab`, `role="tab"`, and
        `data-tab-id="<id>"` for keyboard activation support.
      -->
      <slot name="tabs" :isActive="isActive" :activate="activate" />
    </div>

    <!--
      Slot for tab panels. `activeId` is the currently active tab ID.
    -->
    <slot :activeId="modelValue" :isActive="isActive" />
  </div>
</template>
