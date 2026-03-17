<!--
  SearchPanel — Generic search sidebar for IdeShell.
  Provides search input + results list with slots for custom rendering.
-->
<script setup lang="ts">
import { Input } from '@core/primitives'
import { EmptyState } from '@extras/index'
import { List } from '@lists/index'
import type { ListItem, ID } from '@core/types'

withDefaults(
  defineProps<{
    /** Current search query (v-model) */
    modelValue?: string
    /** Computed search results */
    results?: ListItem[]
    /** Currently selected result ID */
    selected?: ID
    /** Placeholder for search input */
    placeholder?: string
    /** Title shown in sidebar header */
    title?: string
    /** Empty state title when query has no matches */
    noResultsTitle?: string
    /** Empty state title when query is empty */
    idleTitle?: string
    /** Whether the input supports clearing */
    clearable?: boolean
  }>(),
  {
    modelValue: '',
    results: () => [],
    placeholder: 'Search...',
    title: 'Search',
    noResultsTitle: 'No results',
    idleTitle: 'Search',
    clearable: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [id: ID]
}>()

defineSlots<{
  /** Sidebar header — overrides default title */
  header?: (props: Record<string, never>) => unknown
  /** Custom result item rendering */
  item?: (props: { item: ListItem }) => unknown
  /** Custom empty state (no results) */
  'no-results'?: (props: { query: string }) => unknown
  /** Custom idle state (no query) */
  idle?: (props: Record<string, never>) => unknown
}>()

function onSelect(id: ID | ID[]) {
  const selected = Array.isArray(id) ? id[0] : id
  if (selected != null) emit('select', selected)
}
</script>

<template>
  <div data-rig-search-panel>
    <div data-rig-sidebar-header>
      <slot name="header">
        <span>{{ title }}</span>
      </slot>
    </div>

    <div data-rig-search-panel-input>
      <Input
        :model-value="modelValue"
        :placeholder="placeholder"
        :clearable="clearable"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>

    <div data-rig-search-panel-results>
      <List
        v-if="results.length > 0"
        :items="results"
        :selected="selected"
        @update:selected="onSelect"
      >
        <template v-if="$slots.item" #item="{ item }">
          <slot name="item" :item="item" />
        </template>
      </List>

      <slot v-else-if="modelValue?.trim()" name="no-results" :query="modelValue">
        <EmptyState :title="noResultsTitle" :description="`No matches for '${modelValue}'`" />
      </slot>

      <slot v-else name="idle">
        <EmptyState :title="idleTitle" />
      </slot>
    </div>
  </div>
</template>
