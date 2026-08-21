<script setup lang="ts">
import { ref } from 'vue'
import VirtualGrid from './VirtualGrid.vue'

interface Asset {
  id: string
  name: string
  hue: number
}

const assets: Asset[] = Array.from({ length: 10000 }, (_, i) => ({
  id: `a${i}`,
  name: `Asset ${i + 1}`,
  hue: (i * 47) % 360,
}))

const selection = ref<unknown[]>([])
const active = ref<unknown | null>(null)

const pgMinWidth = ref(140)
const pgCaption = ref(24)
const pgSelectable = ref(true)
</script>

<template>
  <Story title="VirtualGrid" icon="lucide:layout-grid" group="lists">
    <Variant title="10,000 tiles">
      <div style="height: 420px; border: 1px solid var(--border)">
        <VirtualGrid
          v-model:selection="selection"
          v-model:active="active"
          :items="assets"
          :caption-height="24"
          selectable
          aria-label="Asset grid"
        >
          <template #item="{ item }">
            <div
              :style="{
                aspectRatio: '1',
                background: `oklch(0.6 0.12 ${item.hue})`,
                borderRadius: 'var(--radius)',
              }"
            />
            <div style="font-size: var(--font-size-xs); padding: 2px 4px">{{ item.name }}</div>
          </template>
        </VirtualGrid>
      </div>
      <div style="margin-top: 8px; font-size: var(--font-size-sm)">
        active: {{ active }} · selected: {{ selection.length }}
      </div>
    </Variant>

    <Variant title="Fixed columns">
      <div style="height: 300px; border: 1px solid var(--border)">
        <VirtualGrid
          :items="assets.slice(0, 60)"
          :columns="6"
          :caption-height="20"
          aria-label="Six columns"
        >
          <template #item="{ item }">
            <div
              :style="{
                aspectRatio: '1',
                background: `oklch(0.7 0.1 ${item.hue})`,
                borderRadius: 'var(--radius)',
              }"
            />
            <div style="font-size: var(--font-size-2xs); padding: 1px 3px">{{ item.name }}</div>
          </template>
        </VirtualGrid>
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="height: 160px; border: 1px solid var(--border)">
        <VirtualGrid :items="[]" aria-label="Empty grid">
          <template #empty>No assets match the current filters.</template>
        </VirtualGrid>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 360px; border: 1px solid var(--border)">
        <VirtualGrid
          v-model:selection="selection"
          v-model:active="active"
          :items="assets"
          :min-column-width="pgMinWidth"
          :caption-height="pgCaption"
          :selectable="pgSelectable"
          aria-label="Playground grid"
        >
          <template #item="{ item }">
            <div
              :style="{
                aspectRatio: '1',
                background: `oklch(0.6 0.12 ${item.hue})`,
                borderRadius: 'var(--radius)',
              }"
            />
            <div v-if="pgCaption" style="font-size: var(--font-size-xs); padding: 2px 4px">
              {{ item.name }}
            </div>
          </template>
        </VirtualGrid>
      </div>
      <template #controls>
        <HstSlider v-model="pgMinWidth" title="minColumnWidth" :min="80" :max="320" />
        <HstSlider v-model="pgCaption" title="captionHeight" :min="0" :max="48" />
        <HstCheckbox v-model="pgSelectable" title="selectable" />
      </template>
    </Variant>
  </Story>
</template>
