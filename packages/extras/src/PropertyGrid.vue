<script setup lang="ts">
import { computed } from 'vue'

export interface PropertyItem {
  key: string
  value?: string
  mono?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Array of key/value items to display */
    items: PropertyItem[]
    /** Width of the key column (CSS value). Defaults to the widest key. */
    keyWidth?: string
  }>(),
  {},
)

defineSlots<{
  [key: string]: (props: { item: PropertyItem }) => unknown
}>()

/** Drives the grid's first track. It used to be a `width` on the key element,
 *  which is a child of a `display: contents` row and therefore sizes nothing. */
const gridStyle = computed(() =>
  props.keyWidth ? { '--rig-property-key-width': props.keyWidth } : undefined,
)
</script>

<template>
  <div
    data-rig-property-grid
    tabindex="-1"
    role="table"
    aria-label="Properties"
    :style="gridStyle"
    @keydown.arrow-down.prevent
    @keydown.arrow-up.prevent
  >
    <div v-for="item in items" :key="item.key" data-rig-property-row role="row">
      <span data-rig-property-key role="cell">
        {{ item.key }}
      </span>
      <span data-rig-property-value role="cell" :data-mono="item.mono || undefined">
        <slot :name="item.key" :item="item">
          {{ item.value }}
        </slot>
      </span>
    </div>
  </div>
</template>
