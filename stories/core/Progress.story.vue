<script setup lang="ts">
import { ref } from 'vue'
import Progress from '@core/primitives/Progress.vue'
const value = ref(42)
const max = ref(100)
const indeterminate = ref(false)
</script>

<template>
  <Story title="Progress" icon="lucide:loader">
    <template #controls>
      <HstSlider v-model="value" title="Value" :min="0" :max="max" />
      <HstNumber v-model="max" title="Max" />
      <HstCheckbox v-model="indeterminate" title="Indeterminate" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 400px">
        <Progress :value="value" :max="max" :indeterminate="indeterminate" />
      </div>
    </Variant>

    <Variant title="Values">
      <div style="padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 16px">
        <Progress :value="0" />
        <Progress :value="25" />
        <Progress :value="50" />
        <Progress :value="75" />
        <Progress :value="100" />
        <Progress indeterminate />
      </div>
    </Variant>
  </Story>
</template>
