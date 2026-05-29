<script setup lang="ts">
import Input from './Input.vue'
import { ref } from 'vue'

const text = ref('')
const disabled = ref(false)
const clearable = ref(true)
const invalid = ref(false)
</script>

<template>
  <Story title="Input" icon="lucide:text-cursor-input" group="core">
    <Variant title="Default">
      <Input v-model="text" placeholder="Type something..." />
    </Variant>

    <Variant title="Clearable">
      <Input v-model="text" placeholder="Clearable input" clearable />
    </Variant>

    <Variant title="Invalid">
      <Input v-model="text" placeholder="Invalid input" invalid described-by="error-msg" />
      <p id="error-msg" style="color: var(--destructive); font-size: 12px; margin-top: 4px">
        This field is required.
      </p>
    </Variant>

    <Variant title="Disabled">
      <Input model-value="Read-only content" disabled placeholder="Disabled" />
    </Variant>

    <Variant title="Playground">
      <Input
        v-model="text"
        placeholder="Playground input"
        :disabled="disabled"
        :clearable="clearable"
        :invalid="invalid"
      />
      <p style="margin-top: 8px; color: var(--muted-foreground); font-size: 12px">
        Value: "{{ text }}"
      </p>

      <template #controls>
        <HstCheckbox v-model="disabled" title="Disabled" />
        <HstCheckbox v-model="clearable" title="Clearable" />
        <HstCheckbox v-model="invalid" title="Invalid" />
      </template>
    </Variant>
  </Story>
</template>
