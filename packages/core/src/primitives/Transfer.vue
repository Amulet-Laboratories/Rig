<script setup lang="ts">
import { ref, computed } from 'vue'

interface TransferItem {
  /** Unique identifier */
  id: string | number
  /** Display label */
  label: string
}

const props = withDefaults(
  defineProps<{
    /** Items in the source list */
    sourceItems?: TransferItem[]
    /** Items in the target list */
    targetItems?: TransferItem[]
    /** Whether the transfer control is disabled */
    disabled?: boolean
    /** Accessible label for the source list */
    sourceLabel?: string
    /** Accessible label for the target list */
    targetLabel?: string
  }>(),
  {
    sourceItems: () => [],
    targetItems: () => [],
    disabled: false,
    sourceLabel: 'Available items',
    targetLabel: 'Selected items',
  },
)

const emit = defineEmits<{
  'update:sourceItems': [items: TransferItem[]]
  'update:targetItems': [items: TransferItem[]]
  move: [direction: 'right' | 'left', items: TransferItem[]]
}>()

defineSlots<{
  'source-item'?: (props: { item: TransferItem; selected: boolean }) => unknown
  'target-item'?: (props: { item: TransferItem; selected: boolean }) => unknown
  'move-right'?: (props: Record<string, never>) => unknown
  'move-left'?: (props: Record<string, never>) => unknown
}>()

const selectedSourceIds = ref<Set<string | number>>(new Set())
const selectedTargetIds = ref<Set<string | number>>(new Set())

const canMoveRight = computed(() => !props.disabled && selectedSourceIds.value.size > 0)
const canMoveLeft = computed(() => !props.disabled && selectedTargetIds.value.size > 0)

function toggleSource(id: string | number) {
  if (props.disabled) return
  const set = new Set(selectedSourceIds.value)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  selectedSourceIds.value = set
}

function toggleTarget(id: string | number) {
  if (props.disabled) return
  const set = new Set(selectedTargetIds.value)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  selectedTargetIds.value = set
}

function moveRight() {
  if (!canMoveRight.value) return
  const toMove = props.sourceItems.filter((item) => selectedSourceIds.value.has(item.id))
  const remaining = props.sourceItems.filter((item) => !selectedSourceIds.value.has(item.id))
  emit('update:sourceItems', remaining)
  emit('update:targetItems', [...props.targetItems, ...toMove])
  emit('move', 'right', toMove)
  selectedSourceIds.value = new Set()
}

function moveLeft() {
  if (!canMoveLeft.value) return
  const toMove = props.targetItems.filter((item) => selectedTargetIds.value.has(item.id))
  const remaining = props.targetItems.filter((item) => !selectedTargetIds.value.has(item.id))
  emit('update:targetItems', remaining)
  emit('update:sourceItems', [...props.sourceItems, ...toMove])
  emit('move', 'left', toMove)
  selectedTargetIds.value = new Set()
}

function onSourceKeydown(e: KeyboardEvent, id: string | number) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggleSource(id)
  }
}

function onTargetKeydown(e: KeyboardEvent, id: string | number) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggleTarget(id)
  }
}
</script>

<template>
  <div data-rig-transfer :data-disabled="disabled || undefined">
    <div
      data-rig-transfer-source
      role="listbox"
      :aria-label="sourceLabel"
      aria-multiselectable="true"
    >
      <div
        v-for="item in sourceItems"
        :key="item.id"
        data-rig-transfer-item
        :data-selected="selectedSourceIds.has(item.id) || undefined"
        role="option"
        :aria-selected="selectedSourceIds.has(item.id)"
        :tabindex="disabled ? -1 : 0"
        @click="toggleSource(item.id)"
        @keydown="onSourceKeydown($event, item.id)"
      >
        <slot name="source-item" :item="item" :selected="selectedSourceIds.has(item.id)">
          {{ item.label }}
        </slot>
      </div>
    </div>

    <div data-rig-transfer-actions>
      <button
        data-rig-transfer-move-right
        :disabled="!canMoveRight"
        :aria-disabled="!canMoveRight"
        aria-label="Move selected items to target"
        @click="moveRight"
      >
        <slot name="move-right">&rsaquo;</slot>
      </button>
      <button
        data-rig-transfer-move-left
        :disabled="!canMoveLeft"
        :aria-disabled="!canMoveLeft"
        aria-label="Move selected items to source"
        @click="moveLeft"
      >
        <slot name="move-left">&lsaquo;</slot>
      </button>
    </div>

    <div
      data-rig-transfer-target
      role="listbox"
      :aria-label="targetLabel"
      aria-multiselectable="true"
    >
      <div
        v-for="item in targetItems"
        :key="item.id"
        data-rig-transfer-item
        :data-selected="selectedTargetIds.has(item.id) || undefined"
        role="option"
        :aria-selected="selectedTargetIds.has(item.id)"
        :tabindex="disabled ? -1 : 0"
        @click="toggleTarget(item.id)"
        @keydown="onTargetKeydown($event, item.id)"
      >
        <slot name="target-item" :item="item" :selected="selectedTargetIds.has(item.id)">
          {{ item.label }}
        </slot>
      </div>
    </div>
  </div>
</template>
