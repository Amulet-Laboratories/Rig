<script setup lang="ts">
import EmptyState from './EmptyState.vue'
import { ref } from 'vue'

const pgTitle = ref('No results found')
const pgDescription = ref('Try adjusting your search or filters.')
const pgIcon = ref('lucide:search')
</script>

<template>
  <Story title="EmptyState" icon="lucide:inbox" group="extras">
    <Variant title="Default">
      <EmptyState
        title="No results found"
        description="Try adjusting your search or filters."
        icon="lucide:search"
      />
    </Variant>

    <Variant title="With Action">
      <EmptyState
        title="No files yet"
        description="Get started by creating your first file."
        icon="lucide:file-plus"
      >
        <template #action>
          <button
            style="
              padding: 8px 16px;
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Create File
          </button>
        </template>
      </EmptyState>
    </Variant>

    <Variant title="Minimal">
      <EmptyState title="Nothing here" />
    </Variant>

    <Variant title="Playground">
      <EmptyState :title="pgTitle" :description="pgDescription" :icon="pgIcon" />

      <template #controls>
        <HstText v-model="pgTitle" title="Title" />
        <HstText v-model="pgDescription" title="Description" />
        <HstText v-model="pgIcon" title="Icon" />
      </template>
    </Variant>
  </Story>
</template>
