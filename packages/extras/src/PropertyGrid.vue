<script setup lang="ts">
export interface PropertyItem {
  key: string
  value?: string
  mono?: boolean
}

withDefaults(
  defineProps<{
    /** Array of key/value items to display */
    items: PropertyItem[]
    /** Width of the key column (CSS value) */
    keyWidth?: string
  }>(),
  {},
)

defineSlots<{
  [key: string]: (props: { item: PropertyItem }) => unknown
}>()
</script>

<template>
  <div
    data-rig-property-grid
    tabindex="-1"
    role="table"
    aria-label="Properties"
    @keydown.arrow-down.prevent
    @keydown.arrow-up.prevent
  >
    <div v-for="item in items" :key="item.key" data-rig-property-row role="row">
      <span
        data-rig-property-key
        role="cell"
        :style="keyWidth ? { width: keyWidth, flexShrink: 0 } : undefined"
      >
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
