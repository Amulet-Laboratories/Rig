<script setup lang="ts">
import ToggleGroup from './ToggleGroup.vue'
import { ref } from 'vue'

const single = ref('bold')
const multiple = ref<string[]>(['bold', 'italic'])
const type = ref<'single' | 'multiple'>('single')
const disabled = ref(false)

const items = [
  { value: 'bold', label: 'B', ariaLabel: 'Bold' },
  { value: 'italic', label: 'I', ariaLabel: 'Italic' },
  { value: 'underline', label: 'U', ariaLabel: 'Underline' },
  { value: 'strikethrough', label: 'S', ariaLabel: 'Strikethrough' },
]
</script>

<template>
  <Story title="ToggleGroup" icon="lucide:toggle-right" group="core">
    <Variant title="Single Select">
      <ToggleGroup v-model="single" :items="items" type="single" />
    </Variant>

    <Variant title="Multiple Select">
      <ToggleGroup v-model="multiple" :items="items" type="multiple" />
    </Variant>

    <Variant title="Vertical">
      <ToggleGroup v-model="single" :items="items" type="single" orientation="vertical" />
    </Variant>

    <Variant title="Disabled">
      <ToggleGroup :model-value="'bold'" :items="items" type="single" disabled />
    </Variant>

    <Variant title="Playground">
      <ToggleGroup
        :model-value="type === 'single' ? single : multiple"
        :items="items"
        :type="type"
        :disabled="disabled"
        @update:model-value="
          (v: string | string[]) => {
            if (type === 'single') single = v as string
            else multiple = v as string[]
          }
        "
      />

      <template #controls>
        <HstSelect v-model="type" title="Type" :options="['single', 'multiple']" />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
