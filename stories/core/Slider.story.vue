<script setup lang="ts">
import { ref } from 'vue'
import Slider from '@core/primitives/Slider.vue'
const value = ref(50)
const min = ref(0)
const max = ref(100)
const step = ref(1)
const disabled = ref(false)
</script>

<template>
  <Story title="Slider" icon="lucide:sliders-horizontal">
    <template #controls>
      <HstNumber v-model="min" title="Min" />
      <HstNumber v-model="max" title="Max" />
      <HstNumber v-model="step" title="Step" />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 320px">
        <p style="margin-bottom: 12px">Value: {{ value }}</p>
        <Slider
          v-model="value"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
        />
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="padding: 24px; height: 200px">
        <Slider v-model="value" orientation="vertical" />
      </div>
    </Variant>
  </Story>
</template>
