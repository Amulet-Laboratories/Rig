<script setup lang="ts">
import { computed } from 'vue'

export interface BarChartDataPoint {
  label: string
  value: number
  color?: string
}

const props = withDefaults(
  defineProps<{
    /** Data points */
    data?: BarChartDataPoint[]
    /** Width of the chart */
    width?: number
    /** Height of the chart */
    height?: number
    /** Orientation */
    orientation?: 'vertical' | 'horizontal'
    /** Whether to show labels */
    showLabels?: boolean
    /** Whether to show values */
    showValues?: boolean
    /** Scale to fill container width/height via CSS instead of fixed dimensions */
    responsive?: boolean
  }>(),
  {
    data: () => [],
    width: 400,
    height: 300,
    orientation: 'vertical',
    showLabels: true,
    showValues: false,
    responsive: false,
  },
)

/**
 * @emits bar-click
 */
const emit = defineEmits<{
  'bar-click': [item: BarChartDataPoint, index: number]
}>()

const padding = { top: 20, right: 20, bottom: 40, left: 50 }
const innerWidth = computed(() => props.width - padding.left - padding.right)
const innerHeight = computed(() => props.height - padding.top - padding.bottom)

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value), 1))

const bars = computed(() => {
  if (props.data.length === 0) return []
  const gap = 4
  const isVertical = props.orientation === 'vertical'

  if (isVertical) {
    const barWidth = (innerWidth.value - (props.data.length - 1) * gap) / props.data.length
    return props.data.map((d, i) => {
      const barHeight = (d.value / maxValue.value) * innerHeight.value
      return {
        x: padding.left + i * (barWidth + gap),
        y: padding.top + innerHeight.value - barHeight,
        width: barWidth,
        height: barHeight,
        label: d.label,
        value: d.value,
        color: d.color,
      }
    })
  } else {
    const barHeight = (innerHeight.value - (props.data.length - 1) * gap) / props.data.length
    return props.data.map((d, i) => {
      const barWidth = (d.value / maxValue.value) * innerWidth.value
      return {
        x: padding.left,
        y: padding.top + i * (barHeight + gap),
        width: barWidth,
        height: barHeight,
        label: d.label,
        value: d.value,
        color: d.color,
      }
    })
  }
})
</script>

<template>
  <svg
    data-rig-bar-chart
    :width="responsive ? undefined : width"
    :height="responsive ? undefined : height"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    aria-label="Bar chart"
    tabindex="0"
    @keydown.stop
  >
    <g data-rig-bar-chart-bars>
      <g
        v-for="(bar, i) in bars"
        :key="i"
        data-rig-bar-chart-bar-group
        @click="emit('bar-click', data[i]!, i)"
      >
        <rect
          data-rig-bar-chart-bar
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          :style="bar.color ? { fill: bar.color } : undefined"
          role="graphics-symbol"
          :aria-label="`${bar.label}: ${bar.value}`"
        />
        <text
          v-if="showLabels && orientation === 'vertical'"
          data-rig-bar-chart-label
          :x="bar.x + bar.width / 2"
          :y="height - 8"
          text-anchor="middle"
          fill="currentColor"
          :font-size="'var(--rig-chart-label-size, 11)'"
        >
          {{ bar.label }}
        </text>
        <text
          v-if="showValues"
          data-rig-bar-chart-value
          :x="orientation === 'vertical' ? bar.x + bar.width / 2 : bar.x + bar.width + 6"
          :y="orientation === 'vertical' ? bar.y - 4 : bar.y + bar.height / 2 + 4"
          :text-anchor="orientation === 'vertical' ? 'middle' : 'start'"
          fill="currentColor"
          :font-size="'var(--rig-chart-label-size, 11)'"
        >
          {{ bar.value }}
        </text>
      </g>
    </g>
  </svg>
</template>
