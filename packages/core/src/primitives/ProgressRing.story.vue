<script setup lang="ts">
import ProgressRing from './ProgressRing.vue'
import { ref } from 'vue'

const value = ref(65)
const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
</script>

<template>
  <Story title="ProgressRing" icon="lucide:disc" group="core">
    <Variant title="Default">
      <ProgressRing :value="65" aria-label="Completion" />
    </Variant>

    <Variant title="Values">
      <div style="display: flex; gap: 16px; align-items: center">
        <ProgressRing :value="0" aria-label="Empty" />
        <ProgressRing :value="25" aria-label="Quarter" />
        <ProgressRing :value="50" aria-label="Half" />
        <ProgressRing :value="75" aria-label="Three quarters" />
        <ProgressRing :value="100" aria-label="Full" />
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 16px; align-items: center">
        <ProgressRing :value="65" size="xs" aria-label="XS" />
        <ProgressRing :value="65" size="sm" aria-label="SM" />
        <ProgressRing :value="65" size="md" aria-label="MD" />
        <ProgressRing :value="65" size="lg" aria-label="LG" />
      </div>
    </Variant>

    <Variant title="With Label">
      <ProgressRing :value="72" aria-label="Score"> 72% </ProgressRing>
    </Variant>

    <Variant title="Playground">
      <ProgressRing :value="value" :size="size" aria-label="Playground ring">
        {{ value }}%
      </ProgressRing>

      <template #controls>
        <HstSlider v-model="value" title="Value" :min="0" :max="100" />
        <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
      </template>
    </Variant>
  </Story>
</template>
