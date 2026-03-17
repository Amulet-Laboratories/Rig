<script setup lang="ts">
import LoadingOverlay from './LoadingOverlay.vue'
import { ref } from 'vue'

const label = ref('Loading')
const active = ref(true)
</script>

<template>
  <Story title="Extras/LoadingOverlay" icon="lucide:loader" group="extras">
    <Variant title="Active">
      <div style="position: relative; height: 200px; border: 1px solid var(--border, #333)">
        <div style="padding: 16px">Content behind the overlay</div>
        <LoadingOverlay active />
      </div>
    </Variant>

    <Variant title="Inactive">
      <div style="position: relative; height: 200px; border: 1px solid var(--border, #333)">
        <div style="padding: 16px">Content is visible when overlay is inactive</div>
        <LoadingOverlay :active="false" />
      </div>
    </Variant>

    <Variant title="Custom Label">
      <div style="position: relative; height: 200px; border: 1px solid var(--border, #333)">
        <div style="padding: 16px">Content behind the overlay</div>
        <LoadingOverlay active label="Fetching data..." />
      </div>
    </Variant>

    <Variant title="Custom Spinner Slot">
      <div style="position: relative; height: 200px; border: 1px solid var(--border, #333)">
        <div style="padding: 16px">Content behind the overlay</div>
        <LoadingOverlay active label="Processing">
          <span style="font-size: 24px; animation: spin 1s linear infinite">&#9881;</span>
        </LoadingOverlay>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="position: relative; height: 200px; border: 1px solid var(--border, #333)">
        <div style="padding: 16px">Toggle the overlay using the controls</div>
        <LoadingOverlay :active="active" :label="label" />
      </div>

      <template #controls>
        <HstCheckbox v-model="active" title="Active" />
        <HstText v-model="label" title="Label" />
      </template>
    </Variant>
  </Story>
</template>
