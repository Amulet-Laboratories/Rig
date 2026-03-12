<script setup lang="ts">
import { ref } from 'vue'
import Input from '@core/primitives/Input.vue'
const value = ref('')
const placeholder = ref('Enter text...')
const disabled = ref(false)
const clearable = ref(true)
const invalid = ref(false)
const type = ref('text')
</script>

<template>
  <Story title="Input" icon="lucide:text-cursor-input">
    <template #controls>
      <HstText v-model="placeholder" title="Placeholder" />
      <HstSelect
        v-model="type"
        title="Type"
        :options="['text', 'email', 'password', 'number', 'search', 'url']"
      />
      <HstCheckbox v-model="disabled" title="Disabled" />
      <HstCheckbox v-model="clearable" title="Clearable" />
      <HstCheckbox v-model="invalid" title="Invalid" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 320px">
        <Input
          v-model="value"
          :placeholder="placeholder"
          :disabled="disabled"
          :clearable="clearable"
          :invalid="invalid"
          :type="type"
        />
      </div>
    </Variant>

    <Variant title="States">
      <div
        style="
          padding: 24px;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        "
      >
        <Input placeholder="Default" />
        <Input model-value="With value" clearable />
        <Input placeholder="Disabled" disabled />
        <Input model-value="Invalid" invalid />
        <Input placeholder="Password" type="password" />
      </div>
    </Variant>
  </Story>
</template>
