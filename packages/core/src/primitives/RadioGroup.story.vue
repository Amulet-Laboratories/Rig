<script setup lang="ts">
import RadioGroup from './RadioGroup.vue'
import { ref } from 'vue'

const selected = ref('vue')
const orientation = ref<'horizontal' | 'vertical'>('vertical')
const disabled = ref(false)

const options = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <Story title="RadioGroup" icon="lucide:circle-dot" group="core">
    <Variant title="Default">
      <RadioGroup v-model="selected" :options="options" label="Framework" />
    </Variant>

    <Variant title="Horizontal">
      <RadioGroup
        v-model="selected"
        :options="options"
        label="Framework"
        orientation="horizontal"
      />
    </Variant>

    <Variant title="Disabled">
      <RadioGroup :model-value="'vue'" :options="options" label="Framework" disabled />
    </Variant>

    <Variant title="Playground">
      <RadioGroup
        v-model="selected"
        :options="options"
        :orientation="orientation"
        :disabled="disabled"
        label="Framework"
      />

      <template #controls>
        <HstSelect
          v-model="orientation"
          title="Orientation"
          :options="['vertical', 'horizontal']"
        />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
