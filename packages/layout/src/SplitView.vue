<script setup lang="ts">
import { Resizer } from '@core/primitives'
import type { Orientation } from '@core/types'

const props = withDefaults(
  defineProps<{
    /** Split direction */
    orientation?: Orientation
    /** Sizes of each pane (in pixels or flex units) */
    sizes?: number[]
    /** Minimum size for each pane */
    minSizes?: number[]
    /** Whether gutters are resizable */
    resizable?: boolean
  }>(),
  {
    orientation: 'horizontal',
    sizes: () => [],
    minSizes: () => [],
    resizable: true,
  },
)

const emit = defineEmits<{
  'update:sizes': [sizes: number[]]
}>()

function onKeydown(e: KeyboardEvent) {
  if (!props.resizable) return
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 10 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -10 : 0
  if (delta) {
    e.preventDefault()
    onResize(0, { delta })
  }
}

function onResize(index: number, payload: { delta: number }) {
  const newSizes = [...props.sizes]
  const minA = props.minSizes[index] ?? 50
  const minB = props.minSizes[index + 1] ?? 50

  const a = (newSizes[index] ?? 0) + payload.delta
  const b = (newSizes[index + 1] ?? 0) - payload.delta

  if (a >= minA && b >= minB) {
    newSizes[index] = a
    newSizes[index + 1] = b
    emit('update:sizes', newSizes)
  }
}
</script>

<template>
  <div data-rig-split-view tabindex="-1" role="group" aria-label="Split view" @keydown="onKeydown" :data-orientation="orientation">
    <template v-for="(size, i) in sizes" :key="i">
      <div
        data-rig-split-pane
        :style="{
          flexBasis: size + 'px',
          flexGrow: 0,
          flexShrink: 0,
        }"
      >
        <slot :name="`pane-${i}`" />
      </div>
      <Resizer
        v-if="resizable && i < sizes.length - 1"
        :orientation="orientation"
        @drag="(payload) => onResize(i, payload)"
      />
    </template>
  </div>
</template>
