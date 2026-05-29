<script setup lang="ts">
import SearchPanel from './SearchPanel.vue'
import { ref, computed } from 'vue'

const allItems = [
  { id: 'button', label: 'Button.vue', description: 'packages/core/src/primitives' },
  { id: 'input', label: 'Input.vue', description: 'packages/core/src/primitives' },
  { id: 'select', label: 'Select.vue', description: 'packages/core/src/primitives' },
  { id: 'badge', label: 'Badge.vue', description: 'packages/core/src/primitives' },
  { id: 'tree-view', label: 'TreeView.vue', description: 'packages/lists/src' },
  { id: 'list', label: 'List.vue', description: 'packages/lists/src' },
]

const query = ref('')
const results = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return allItems.filter(
    (item) => item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
  )
})

const pgTitle = ref('Search')
const pgPlaceholder = ref('Search...')
const pgNoResultsTitle = ref('No results')
const pgIdleTitle = ref('Search')
const pgClearable = ref(true)
</script>

<template>
  <Story title="SearchPanel" icon="lucide:search" group="shell">
    <Variant title="Default">
      <div style="height: 400px; width: 280px; border: 1px solid var(--border)">
        <SearchPanel
          v-model="query"
          :results="results"
          title="Search"
          placeholder="Search files..."
        />
      </div>
    </Variant>

    <Variant title="With Results">
      <div style="height: 400px; width: 280px; border: 1px solid var(--border)">
        <SearchPanel
          model-value="vue"
          :results="allItems.filter((i) => i.label.includes('Vue'))"
          title="Search"
        />
      </div>
    </Variant>

    <Variant title="No Results">
      <div style="height: 400px; width: 280px; border: 1px solid var(--border)">
        <SearchPanel
          model-value="zzz"
          :results="[]"
          title="Search"
          no-results-title="Nothing found"
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 400px; width: 280px; border: 1px solid var(--border)">
        <SearchPanel
          v-model="query"
          :results="results"
          :title="pgTitle"
          :placeholder="pgPlaceholder"
          :no-results-title="pgNoResultsTitle"
          :idle-title="pgIdleTitle"
          :clearable="pgClearable"
        />
      </div>

      <template #controls>
        <HstText v-model="pgTitle" title="Title" />
        <HstText v-model="pgPlaceholder" title="Placeholder" />
        <HstText v-model="pgNoResultsTitle" title="No Results Title" />
        <HstText v-model="pgIdleTitle" title="Idle Title" />
        <HstCheckbox v-model="pgClearable" title="Clearable" />
      </template>
    </Variant>
  </Story>
</template>
