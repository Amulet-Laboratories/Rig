<script setup lang="ts">
import PropertyGrid from './PropertyGrid.vue'
import { ref } from 'vue'

const items = [
  { key: 'Name', value: 'Button.vue' },
  { key: 'Type', value: 'Vue Component' },
  { key: 'Size', value: '2.4 KB' },
  { key: 'Modified', value: '2024-01-15 10:42:00' },
  { key: 'Path', value: 'packages/core/src/primitives/', mono: true },
  { key: 'Exports', value: '3 named exports', mono: true },
]

const pgKeyWidth = ref('120px')
</script>

<template>
  <Story title="PropertyGrid" icon="lucide:list-tree" group="extras">
    <Variant title="Default">
      <div style="width: 360px">
        <PropertyGrid :items="items" />
      </div>
    </Variant>

    <Variant title="Custom Key Width">
      <div style="width: 400px">
        <PropertyGrid :items="items" key-width="140px" />
      </div>
    </Variant>

    <Variant title="Few Items">
      <div style="width: 320px">
        <PropertyGrid
          :items="[
            { key: 'Status', value: 'Active' },
            { key: 'Version', value: '1.0.0' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 400px">
        <PropertyGrid :items="items" :key-width="pgKeyWidth" />
      </div>

      <template #controls>
        <HstText v-model="pgKeyWidth" title="Key Width (CSS)" />
      </template>
    </Variant>
  </Story>
</template>
