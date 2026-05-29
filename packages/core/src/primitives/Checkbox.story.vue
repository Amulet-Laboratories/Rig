<script setup lang="ts">
import Checkbox from './Checkbox.vue'
import { ref } from 'vue'

const checked = ref(false)
const disabled = ref(false)
const indeterminate = ref(false)
</script>

<template>
  <Story title="Checkbox" icon="lucide:check-square" group="core">
    <Variant title="Default">
      <Checkbox v-model="checked" aria-label="Accept terms" />
    </Variant>

    <Variant title="States">
      <div style="display: flex; gap: 16px; align-items: center">
        <label style="display: flex; align-items: center; gap: 6px; color: var(--foreground)">
          <Checkbox :model-value="false" aria-label="Unchecked" />
          Unchecked
        </label>
        <label style="display: flex; align-items: center; gap: 6px; color: var(--foreground)">
          <Checkbox model-value aria-label="Checked" />
          Checked
        </label>
        <label style="display: flex; align-items: center; gap: 6px; color: var(--foreground)">
          <Checkbox :model-value="false" indeterminate aria-label="Indeterminate" />
          Indeterminate
        </label>
        <label style="display: flex; align-items: center; gap: 6px; color: var(--muted-foreground)">
          <Checkbox :model-value="false" disabled aria-label="Disabled" />
          Disabled
        </label>
      </div>
    </Variant>

    <Variant title="Playground">
      <label style="display: flex; align-items: center; gap: 6px; color: var(--foreground)">
        <Checkbox
          v-model="checked"
          :disabled="disabled"
          :indeterminate="indeterminate"
          aria-label="Playground checkbox"
        />
        Check me
      </label>

      <template #controls>
        <HstCheckbox v-model="checked" title="Checked" />
        <HstCheckbox v-model="disabled" title="Disabled" />
        <HstCheckbox v-model="indeterminate" title="Indeterminate" />
      </template>
    </Variant>
  </Story>
</template>
