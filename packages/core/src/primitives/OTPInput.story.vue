<script setup lang="ts">
import OTPInput from './OTPInput.vue'
import { ref } from 'vue'

const defaultOtp = ref('')
const fourOtp = ref('')
const maskedOtp = ref('')
const playOtp = ref('')
const length = ref(6)
const mask = ref(false)
const disabled = ref(false)
const completed = ref('')
</script>

<template>
  <Story title="OTPInput" icon="lucide:key-round" group="core">
    <Variant title="Default">
      <OTPInput v-model="defaultOtp" @complete="(v) => (completed = v)" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: "{{ defaultOtp }}"
        <span v-if="completed"> | Completed: {{ completed }}</span>
      </div>
    </Variant>

    <Variant title="4 Digits">
      <OTPInput v-model="fourOtp" :length="4" />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: "{{ fourOtp }}"
      </div>
    </Variant>

    <Variant title="Masked">
      <OTPInput v-model="maskedOtp" mask />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: "{{ maskedOtp }}"
      </div>
    </Variant>

    <Variant title="Disabled">
      <OTPInput model-value="123456" disabled />
    </Variant>

    <Variant title="Playground">
      <OTPInput
        v-model="playOtp"
        :length="length"
        :mask="mask"
        :disabled="disabled"
        @complete="(v) => (completed = v)"
      />
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Value: "{{ playOtp }}"
        <span v-if="completed"> | Completed: {{ completed }}</span>
      </div>

      <template #controls>
        <HstSlider v-model="length" title="Length" :min="3" :max="8" :step="1" />
        <HstCheckbox v-model="mask" title="Masked" />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
