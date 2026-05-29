<script setup lang="ts">
import Pagination from './Pagination.vue'
import { ref } from 'vue'

const page = ref(1)
const manyPage = ref(5)
const playPage = ref(1)
const total = ref(100)
const pageSize = ref(10)
const siblingCount = ref(1)
const disabled = ref(false)
</script>

<template>
  <Story title="Pagination" icon="lucide:chevrons-left-right-ellipsis" group="core">
    <Variant title="Default">
      <Pagination v-model="page" :total="100" :page-size="10" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Page: {{ page }}
      </div>
    </Variant>

    <Variant title="Many Pages">
      <Pagination v-model="manyPage" :total="500" :page-size="10" :sibling-count="2" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Page: {{ manyPage }}
      </div>
    </Variant>

    <Variant title="Disabled">
      <Pagination :model-value="3" :total="100" :page-size="10" disabled />
    </Variant>

    <Variant title="Playground">
      <Pagination
        v-model="playPage"
        :total="total"
        :page-size="pageSize"
        :sibling-count="siblingCount"
        :disabled="disabled"
      />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Page: {{ playPage }} / {{ Math.ceil(total / pageSize) }}
      </div>

      <template #controls>
        <HstSlider v-model="total" title="Total Items" :min="0" :max="500" :step="10" />
        <HstSlider v-model="pageSize" title="Page Size" :min="1" :max="50" :step="1" />
        <HstSlider v-model="siblingCount" title="Sibling Count" :min="0" :max="5" :step="1" />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
