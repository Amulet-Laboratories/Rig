<script setup lang="ts">
import NumberInput from './NumberInput.vue'
import { ref } from 'vue'

const defaultVal = ref(0)
const minMaxVal = ref(5)
const stepVal = ref(0)
const playVal = ref(0)
const min = ref(0)
const max = ref(100)
const step = ref(1)
const disabled = ref(false)
const placeholder = ref('')
</script>

<template>
  <Story title="NumberInput" icon="lucide:hash" group="core">
    <Variant title="Default">
      <NumberInput v-model="defaultVal" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: {{ defaultVal }}
      </div>
    </Variant>

    <Variant title="With Min/Max">
      <NumberInput v-model="minMaxVal" :min="0" :max="10" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: {{ minMaxVal }} (range: 0-10)
      </div>
    </Variant>

    <Variant title="Step">
      <NumberInput v-model="stepVal" :step="5" :min="0" :max="100" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: {{ stepVal }} (step: 5)
      </div>
    </Variant>

    <Variant title="Disabled">
      <NumberInput :model-value="42" disabled />
    </Variant>

    <Variant title="Playground">
      <NumberInput
        v-model="playVal"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :placeholder="placeholder || undefined"
      />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: {{ playVal }}
      </div>

      <template #controls>
        <HstSlider v-model="min" title="Min" :min="-100" :max="0" :step="1" />
        <HstSlider v-model="max" title="Max" :min="1" :max="1000" :step="1" />
        <HstSlider v-model="step" title="Step" :min="1" :max="50" :step="1" />
        <HstCheckbox v-model="disabled" title="Disabled" />
        <HstText v-model="placeholder" title="Placeholder" />
      </template>
    </Variant>
  </Story>
</template>
