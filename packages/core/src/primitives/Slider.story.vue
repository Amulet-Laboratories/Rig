<script setup lang="ts">
import Slider from './Slider.vue'
import { ref } from 'vue'

const value = ref(50)
const disabled = ref(false)
const orientation = ref<'horizontal' | 'vertical'>('horizontal')
</script>

<template>
  <Story title="Slider" icon="lucide:sliders" group="core">
    <Variant title="Default">
      <div style="width: 300px">
        <Slider v-model="value" aria-label="Volume" />
      </div>
      <div style="color: var(--muted-foreground); font-size: 12px; margin-top: 8px">
        Value: {{ value }}
      </div>
    </Variant>

    <Variant title="Custom Range">
      <div style="width: 300px">
        <Slider :model-value="250" :min="0" :max="1000" :step="10" aria-label="Custom" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="width: 300px">
        <Slider :model-value="50" disabled aria-label="Disabled" />
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="height: 200px">
        <Slider :model-value="60" orientation="vertical" aria-label="Vertical" />
      </div>
    </Variant>

    <Variant title="Playground">
      <div :style="orientation === 'vertical' ? { height: '200px' } : { width: '300px' }">
        <Slider
          v-model="value"
          :disabled="disabled"
          :orientation="orientation"
          aria-label="Playground slider"
        />
      </div>

      <template #controls>
        <HstSlider v-model="value" title="Value" :min="0" :max="100" />
        <HstSelect
          v-model="orientation"
          title="Orientation"
          :options="['horizontal', 'vertical']"
        />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
