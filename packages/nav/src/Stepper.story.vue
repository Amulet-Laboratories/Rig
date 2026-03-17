<script setup lang="ts">
import Stepper from './Stepper.vue'
import { ref } from 'vue'

const current = ref(1)
const orientation = ref<'horizontal' | 'vertical'>('horizontal')

const steps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Review', description: 'Review your details' },
  { label: 'Confirm', description: 'Confirm and submit' },
]
</script>

<template>
  <Story title="Stepper" icon="lucide:list-ordered" group="nav">
    <Variant title="Horizontal">
      <Stepper
        :steps="steps"
        :current="current"
        orientation="horizontal"
        @select="(i) => (current = i)"
      />
      <div style="margin-top: 16px; display: flex; gap: 8px">
        <button
          :disabled="current === 0"
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="current--"
        >
          Previous
        </button>
        <button
          :disabled="current === steps.length - 1"
          style="
            padding: 6px 12px;
            background: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
          @click="current++"
        >
          Next
        </button>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="width: 280px">
        <Stepper
          :steps="steps"
          :current="current"
          orientation="vertical"
          @select="(i) => (current = i)"
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <Stepper
        :steps="steps"
        :current="current"
        :orientation="orientation"
        @select="(i) => (current = i)"
      />

      <template #controls>
        <HstSlider v-model="current" title="Current" :min="0" :max="3" />
        <HstSelect
          v-model="orientation"
          title="Orientation"
          :options="['horizontal', 'vertical']"
        />
      </template>
    </Variant>
  </Story>
</template>
