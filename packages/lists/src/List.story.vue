<script setup lang="ts">
import List from './List.vue'
import { ref } from 'vue'

const selected = ref<string>('item-1')
const pgMultiSelect = ref(false)
const pgVirtual = ref(false)

const items = [
  { id: 'item-1', label: 'Dashboard', icon: 'lucide:layout-dashboard' },
  { id: 'item-2', label: 'Analytics', icon: 'lucide:bar-chart-2' },
  { id: 'item-3', label: 'Users', icon: 'lucide:users' },
  { id: 'item-4', label: 'Settings', icon: 'lucide:settings' },
  { id: 'item-5', label: 'Help', icon: 'lucide:help-circle' },
]
</script>

<template>
  <Story title="List" icon="lucide:list" group="lists">
    <Variant title="Default">
      <div style="width: 260px; border: 1px solid var(--border)">
        <List v-model:selected="selected" :items="items" aria-label="Navigation" />
      </div>
    </Variant>

    <Variant title="Multi Select">
      <div style="width: 260px; border: 1px solid var(--border)">
        <List
          :selected="['item-1', 'item-3']"
          :items="items"
          multi-select
          aria-label="Multi select"
        />
      </div>
    </Variant>

    <Variant title="Virtual Scroll">
      <div style="width: 260px; height: 200px; border: 1px solid var(--border)">
        <List
          v-model:selected="selected"
          :items="
            Array.from({ length: 1000 }, (_, i) => ({ id: `v-${i}`, label: `Item ${i + 1}` }))
          "
          virtual
          :item-height="24"
          aria-label="Virtual list"
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <div
        style="width: 260px; border: 1px solid var(--border)"
        :style="pgVirtual ? { height: '200px' } : {}"
      >
        <List
          v-model:selected="selected"
          :items="
            pgVirtual
              ? Array.from({ length: 500 }, (_, i) => ({ id: `pg-${i}`, label: `Item ${i + 1}` }))
              : items
          "
          :multi-select="pgMultiSelect"
          :virtual="pgVirtual"
          :item-height="24"
          aria-label="Playground list"
        />
      </div>

      <template #controls>
        <HstCheckbox v-model="pgMultiSelect" title="Multi Select" />
        <HstCheckbox v-model="pgVirtual" title="Virtual Scroll" />
      </template>
    </Variant>
  </Story>
</template>
