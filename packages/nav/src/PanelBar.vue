<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TabItem, ID } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Available tabs */
    tabs: TabItem[]
    /** Currently active tab ID */
    activeId?: ID
  }>(),
  {},
)

const emit = defineEmits<{
  'update:activeId': [id: ID]
  close: [id: ID]
}>()

const focusedIndex = ref(0)
const tabRefs = ref<HTMLElement[]>([])

function setTabRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) {
    tabRefs.value[index] = el
  }
}

function activateTab(tab: TabItem) {
  emit('update:activeId', tab.id)
}

function closeTab(id: ID, e: MouseEvent) {
  e.stopPropagation()
  emit('close', id)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    focusedIndex.value = Math.min(focusedIndex.value + 1, props.tabs.length - 1)
    tabRefs.value[focusedIndex.value]?.focus()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
    tabRefs.value[focusedIndex.value]?.focus()
  }
}

const activeTab = computed(() => props.tabs.find((t) => t.id === props.activeId))
</script>

<template>
  <div data-rig-panel-bar>
    <div data-rig-panel-bar-tabs role="tablist" @keydown="onKeydown">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :ref="(el) => setTabRef(el, index)"
        data-rig-panel-bar-tab
        role="tab"
        :aria-selected="activeId === tab.id"
        :data-state="activeId === tab.id ? 'active' : 'inactive'"
        :tabindex="index === focusedIndex ? 0 : -1"
        @click="activateTab(tab)"
      >
        <slot name="tab" :tab="tab" :active="activeId === tab.id">
          {{ tab.label }}
        </slot>
        <button
          v-if="tab.closable"
          data-rig-panel-bar-close
          aria-label="Close tab"
          tabindex="-1"
          @click="closeTab(tab.id, $event)"
        >
          &times;
        </button>
      </button>
    </div>
    <div data-rig-panel-bar-content role="tabpanel">
      <slot :activeId="activeId" :activeTab="activeTab" />
    </div>
  </div>
</template>
