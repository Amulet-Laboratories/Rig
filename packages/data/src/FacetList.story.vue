<script setup lang="ts">
import { ref } from 'vue'
import FacetList from './FacetList.vue'

const rights = ref<string[]>(['cc0'])
const tags = ref<string[]>([])

const rightsOptions = [
  { value: 'cc0', label: 'CC0', count: 15385 },
  { value: 'licensed', count: 10672 },
  { value: 'reference', count: 28495 },
]

const tagOptions = [
  'lowpoly',
  'albedo-only',
  'res-small',
  'tileable',
  'object-skin',
  'midpoly',
  'untextured',
  'non-square',
  'res-1k',
  'pbr',
  'rigged',
  'animated',
  'wall',
  'road',
  'roof',
  'floor',
  'stair',
  'door',
  'window',
  'pillar',
  'collision',
  'modular',
  'godot-scene',
  'res-2k',
  'res-4k',
  'highpoly',
].map((t, i) => ({ value: t, count: Math.max(0, 24000 - i * 950) }))
</script>

<template>
  <Story title="FacetList" icon="lucide:list-checks" group="data">
    <Variant title="Rights">
      <div style="width: 240px">
        <FacetList v-model="rights" :options="rightsOptions" title="Rights" />
      </div>
      <div style="margin-top: 8px; font-size: var(--font-size-sm)">model: {{ rights }}</div>
    </Variant>

    <Variant title="Searchable, folded">
      <div style="width: 240px">
        <FacetList v-model="tags" :options="tagOptions" title="Tags" searchable :limit="8" />
      </div>
      <div style="margin-top: 8px; font-size: var(--font-size-sm)">model: {{ tags }}</div>
    </Variant>

    <Variant title="Zero counts stay visible">
      <div style="width: 240px">
        <FacetList
          :options="[
            { value: 'model', count: 128 },
            { value: 'surface', count: 0 },
          ]"
          title="Kind"
        />
      </div>
    </Variant>
  </Story>
</template>
