<script setup lang="ts">
import Heatmap from './Heatmap.vue'
import { ref } from 'vue'

const data = Array.from({ length: 35 }, (_, i) => ({
  row: Math.floor(i / 7),
  col: i % 7,
  value: Math.round(Math.random() * 100),
}))

const rowLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const colLabels = ['6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am']

const cellSize = ref(32)
const gap = ref(2)
const lastCellClick = ref('')

function onCellClick(cell: { row: number; col: number; value: number }) {
  const rowLabel = rowLabels[cell.row] ?? `Row ${cell.row}`
  const colLabel = colLabels[cell.col] ?? `Col ${cell.col}`
  lastCellClick.value = `${rowLabel} @ ${colLabel}: ${cell.value}`
}
</script>

<template>
  <Story title="Heatmap" icon="lucide:grid-3x3" group="data">
    <Variant title="Default">
      <Heatmap
        :data="data"
        :rows="5"
        :cols="7"
        :row-labels="rowLabels"
        :col-labels="colLabels"
        @cell-click="onCellClick"
      />
      <div
        v-if="lastCellClick"
        style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
      >
        Clicked: {{ lastCellClick }}
      </div>
    </Variant>

    <Variant title="Compact">
      <Heatmap
        :data="data"
        :rows="5"
        :cols="7"
        :cell-size="20"
        :gap="1"
        @cell-click="onCellClick"
      />
    </Variant>

    <Variant title="Large Cells">
      <Heatmap
        :data="data"
        :rows="5"
        :cols="7"
        :row-labels="rowLabels"
        :col-labels="colLabels"
        :cell-size="48"
        :gap="4"
        @cell-click="onCellClick"
      />
    </Variant>

    <Variant title="Playground">
      <Heatmap
        :data="data"
        :rows="5"
        :cols="7"
        :row-labels="rowLabels"
        :col-labels="colLabels"
        :cell-size="cellSize"
        :gap="gap"
        @cell-click="onCellClick"
      />
      <div
        v-if="lastCellClick"
        style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
      >
        {{ lastCellClick }}
      </div>

      <template #controls>
        <HstSlider v-model="cellSize" title="Cell Size" :min="12" :max="64" />
        <HstSlider v-model="gap" title="Gap" :min="0" :max="8" />
      </template>
    </Variant>
  </Story>
</template>
