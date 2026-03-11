<script setup lang="ts">
export interface PropertyItem {
  key: string
  value?: string
  mono?: boolean
}

defineProps<{
  /** Array of key/value items to display */
  items: PropertyItem[]
  /** Width of the key column (CSS value) */
  keyWidth?: string
}>()
</script>

<template>
  <div data-rig-property-grid>
    <div v-for="item in items" :key="item.key" data-rig-property-row>
      <span
        data-rig-property-key
        :style="keyWidth ? { width: keyWidth, flexShrink: 0 } : undefined"
      >
        {{ item.key }}
      </span>
      <span data-rig-property-value :data-mono="item.mono || undefined">
        <slot :name="item.key" :item="item">
          {{ item.value }}
        </slot>
      </span>
    </div>
  </div>
</template>
