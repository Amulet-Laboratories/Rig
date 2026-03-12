<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '@core/primitives/Checkbox.vue'
const checked = ref(false)
const disabled = ref(false)
const indeterminate = ref(false)
</script>

<template>
  <Story title="Checkbox" icon="lucide:check-square">
    <template #controls>
      <HstCheckbox v-model="disabled" title="Disabled" />
      <HstCheckbox v-model="indeterminate" title="Indeterminate" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px">
        <Checkbox v-model="checked" :disabled="disabled" :indeterminate="indeterminate">
          Accept terms and conditions
        </Checkbox>
      </div>
    </Variant>

    <Variant title="States">
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px">
        <Checkbox :model-value="false">Unchecked</Checkbox>
        <Checkbox model-value>Checked</Checkbox>
        <Checkbox :model-value="false" indeterminate>Indeterminate</Checkbox>
        <Checkbox :model-value="false" disabled>Disabled</Checkbox>
        <Checkbox model-value disabled>Checked + Disabled</Checkbox>
      </div>
    </Variant>
  </Story>
</template>
