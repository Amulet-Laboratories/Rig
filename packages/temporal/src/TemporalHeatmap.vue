<script setup lang="ts">
import { computed } from 'vue'

export interface TemporalHeatmapCell {
  time: number
  category: number
  value: number
}

const props = withDefaults(
  defineProps<{
    /** Cell data */
    data?: TemporalHeatmapCell[]
    /** Time labels (x-axis) */
    timeLabels?: string[]
    /** Category labels (y-axis) */
    categoryLabels?: string[]
    /** Number of time slots */
    timeSlots?: number
    /** Number of categories */
    categories?: number
    /** Cell size */
    cellSize?: number
    /** Gap between cells */
    gap?: number
  }>(),
  {
    data: () => [],
    timeLabels: () => [],
    categoryLabels: () => [],
    timeSlots: 24,
    categories: 7,
    cellSize: 16,
    gap: 2,
  },
)

/**
 * @emits cell-click
 */
const emit = defineEmits<{
  'cell-click': [cell: TemporalHeatmapCell]
}>()

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value), 1))

const labelOffset = computed(() => (props.categoryLabels.length ? 80 : 0))
const headerOffset = computed(() => (props.timeLabels.length ? 24 : 0))

const svgWidth = computed(() => labelOffset.value + props.timeSlots * (props.cellSize + props.gap))
const svgHeight = computed(
  () => headerOffset.value + props.categories * (props.cellSize + props.gap),
)

function getCellValue(time: number, category: number): number {
  return props.data.find((d) => d.time === time && d.category === category)?.value ?? 0
}

function getIntensity(value: number): number {
  return value / maxValue.value
}
</script>

<template>
  <svg
    data-rig-temporal-heatmap
    :width="svgWidth"
    :height="svgHeight"
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    role="img"
    aria-label="Temporal heatmap"
    tabindex="0"
    @keydown.stop
  >
    <!-- Time labels -->
    <g v-if="timeLabels.length" data-rig-temporal-heatmap-time-labels>
      <text
        v-for="(label, ti) in timeLabels"
        :key="ti"
        :x="labelOffset + ti * (cellSize + gap) + cellSize / 2"
        :y="14"
        text-anchor="middle"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 9)'"
      >
        {{ label }}
      </text>
    </g>
    <!-- Category labels -->
    <g v-if="categoryLabels.length" data-rig-temporal-heatmap-category-labels>
      <text
        v-for="(label, ci) in categoryLabels"
        :key="ci"
        :x="labelOffset - 6"
        :y="headerOffset + ci * (cellSize + gap) + cellSize / 2 + 4"
        text-anchor="end"
        fill="currentColor"
        :font-size="'var(--rig-chart-label-size, 9)'"
      >
        {{ label }}
      </text>
    </g>
    <!-- Cells -->
    <g data-rig-temporal-heatmap-cells>
      <template v-for="cat in categories" :key="`cat-${cat}`">
        <rect
          v-for="time in timeSlots"
          :key="`${cat}-${time}`"
          data-rig-temporal-heatmap-cell
          :x="labelOffset + (time - 1) * (cellSize + gap)"
          :y="headerOffset + (cat - 1) * (cellSize + gap)"
          :width="cellSize"
          :height="cellSize"
          fill="currentColor"
          :opacity="getIntensity(getCellValue(time - 1, cat - 1)) * 0.9 + 0.1"
          :rx="'var(--rig-chart-cell-radius, 2)'"
          role="graphics-symbol"
          :aria-label="`Time ${time}, Category ${cat}: ${getCellValue(time - 1, cat - 1)}`"
          @click="
            emit('cell-click', {
              time: time - 1,
              category: cat - 1,
              value: getCellValue(time - 1, cat - 1),
            })
          "
        />
      </template>
    </g>
  </svg>
</template>
