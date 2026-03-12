<script setup lang="ts">
import { ref } from 'vue'
import Radio from '@core/primitives/Radio.vue'
const value = ref('option-1')
</script>

<template>
  <Story title="Radio" icon="lucide:circle-dot">
        <Variant title="Interactive">
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 8px">
        <Radio v-model="value" value="option-1" name="demo">Option 1</Radio>
        <Radio v-model="value" value="option-2" name="demo">Option 2</Radio>
        <Radio v-model="value" value="option-3" name="demo">Option 3</Radio>
      </div>
    </Variant>

    <Variant title="States">
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 8px">
        <Radio model-value="a" value="a" name="states">Selected</Radio>
        <Radio model-value="a" value="b" name="states">Unselected</Radio>
        <Radio model-value="a" value="c" name="states" disabled>Disabled</Radio>
      </div>
    </Variant>
  </Story>
</template>
