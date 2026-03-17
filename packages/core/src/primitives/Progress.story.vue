<script setup lang="ts">
import Progress from './Progress.vue'
import { ref } from 'vue'

const value = ref(45)
const indeterminate = ref(false)
</script>

<template>
  <Story title="Progress" icon="lucide:loader" group="core">
    <Variant title="Default">
      <Progress :value="45" aria-label="Download progress" />
    </Variant>

    <Variant title="Values">
      <div style="display: flex; flex-direction: column; gap: 12px; width: 300px">
        <Progress :value="0" aria-label="Empty" />
        <Progress :value="25" aria-label="Quarter" />
        <Progress :value="50" aria-label="Half" />
        <Progress :value="75" aria-label="Three quarters" />
        <Progress :value="100" aria-label="Full" />
      </div>
    </Variant>

    <Variant title="Indeterminate">
      <div style="width: 300px">
        <Progress indeterminate aria-label="Loading" />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 300px">
        <Progress :value="value" :indeterminate="indeterminate" aria-label="Playground progress" />
      </div>

      <template #controls>
        <HstSlider v-model="value" title="Value" :min="0" :max="100" />
        <HstCheckbox v-model="indeterminate" title="Indeterminate" />
      </template>
    </Variant>
  </Story>
</template>
