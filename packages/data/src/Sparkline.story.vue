<script setup lang="ts">
import Sparkline from './Sparkline.vue'
import { ref } from 'vue'

const pgWidth = ref(120)
const pgHeight = ref(32)
const pgStrokeWidth = ref(2)
const pgFill = ref(false)
</script>

<template>
  <Story title="Sparkline" icon="lucide:trending-up" group="data">
    <Variant title="Default">
      <Sparkline :data="[4, 8, 3, 12, 7, 9, 15, 6, 11, 8]" />
    </Variant>

    <Variant title="With labels">
      <div style="display: flex; gap: 24px; align-items: center">
        <div>
          <span style="color: var(--muted-foreground); font-size: 12px">Revenue</span>
          <Sparkline :data="[10, 14, 8, 22, 18, 25, 30, 28, 35, 40]" />
        </div>
        <div>
          <span style="color: var(--muted-foreground); font-size: 12px">Users</span>
          <Sparkline :data="[50, 45, 60, 55, 70, 65, 80, 75, 90, 85]" />
        </div>
        <div>
          <span style="color: var(--muted-foreground); font-size: 12px">Errors</span>
          <Sparkline :data="[20, 15, 25, 10, 5, 8, 3, 2, 1, 0]" />
        </div>
      </div>
    </Variant>

    <Variant title="Single value">
      <Sparkline :data="[42]" />
    </Variant>

    <Variant title="Empty">
      <Sparkline :data="[]" />
    </Variant>

    <Variant title="Playground">
      <Sparkline
        :data="[4, 8, 3, 12, 7, 9, 15, 6, 11, 8]"
        :width="pgWidth"
        :height="pgHeight"
        :stroke-width="pgStrokeWidth"
        :fill="pgFill"
      />

      <template #controls>
        <HstSlider v-model="pgWidth" title="Width" :min="60" :max="300" />
        <HstSlider v-model="pgHeight" title="Height" :min="16" :max="80" />
        <HstSlider v-model="pgStrokeWidth" title="Stroke Width" :min="1" :max="6" />
        <HstCheckbox v-model="pgFill" title="Fill" />
      </template>
    </Variant>
  </Story>
</template>
