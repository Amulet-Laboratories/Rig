<script setup lang="ts">
import EmptyState from '@extras/EmptyState.vue'
import Button from '@core/primitives/Button.vue'

</script>

<template>
  <Story title="EmptyState" icon="lucide:inbox">
        <Variant title="With Action">
      <div style="padding: 48px; display: flex; justify-content: center">
        <EmptyState
          title="No results found"
          description="Try adjusting your search or filters to find what you're looking for."
          icon="mdi:magnify"
        >
          <template #action>
            <Button>Clear Filters</Button>
          </template>
        </EmptyState>
      </div>
    </Variant>

    <Variant title="Minimal">
      <div style="padding: 48px; display: flex; justify-content: center">
        <EmptyState title="Nothing here yet" icon="mdi:folder-open-outline" />
      </div>
    </Variant>
  </Story>
</template>
