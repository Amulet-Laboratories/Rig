<script setup lang="ts">
import { ref } from 'vue'
import Radio from '@core/primitives/Radio.vue'
import RadioGroup from '@core/primitives/RadioGroup.vue'
const value = ref('medium')
const disabled = ref(false)
const orientation = ref<'vertical' | 'horizontal'>('vertical')
</script>

<template>
  <Story title="RadioGroup" icon="lucide:circle-dot">
    <template #controls>
      <HstSelect
        v-model="orientation"
        title="Orientation"
        :options="['vertical', 'horizontal']"
      />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px">
        <RadioGroup
          v-model="value"
          label="Choose a size"
          :orientation="orientation"
          :disabled="disabled"
        >
          <template #default>
            <Radio v-model="value" value="small" name="size">Small</Radio>
            <Radio v-model="value" value="medium" name="size">Medium</Radio>
            <Radio v-model="value" value="large" name="size">Large</Radio>
          </template>
        </RadioGroup>
        <p style="margin-top: 12px">Selected: {{ value }}</p>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 24px">
        <RadioGroup model-value="a" label="Disabled group" disabled>
          <template #default>
            <Radio model-value="a" value="a" name="disabled-group">Option A</Radio>
            <Radio model-value="a" value="b" name="disabled-group">Option B</Radio>
          </template>
        </RadioGroup>
      </div>
    </Variant>
  </Story>
</template>
