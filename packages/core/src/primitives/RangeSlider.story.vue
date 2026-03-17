<script setup lang="ts">
import RangeSlider from './RangeSlider.vue'
import { ref } from 'vue'

const range = ref<[number, number]>([25, 75])
const disabled = ref(false)
</script>

<template>
  <Story title="RangeSlider" icon="lucide:sliders-horizontal" group="core">
    <Variant title="Default">
      <div style="width: 300px">
        <RangeSlider v-model="range" />
      </div>
      <div style="color: var(--muted-foreground); font-size: 12px; margin-top: 8px">
        Range: {{ range[0] }} - {{ range[1] }}
      </div>
    </Variant>

    <Variant title="Custom Range">
      <div style="width: 300px">
        <RangeSlider :model-value="[200, 800]" :min="0" :max="1000" :step="50" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="width: 300px">
        <RangeSlider :model-value="[30, 70]" disabled />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 300px">
        <RangeSlider v-model="range" :disabled="disabled" />
      </div>
      <div style="color: var(--muted-foreground); font-size: 12px; margin-top: 8px">
        {{ range[0] }} - {{ range[1] }}
      </div>

      <template #controls>
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
