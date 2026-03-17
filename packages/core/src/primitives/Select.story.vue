<script setup lang="ts">
import Select from './Select.vue'
import { ref } from 'vue'

const selected = ref('')
const pgSelected = ref('')
const pgDisabled = ref(false)
const pgPlaceholder = ref('Choose a country...')
const lastChanged = ref('')

const options = [
  { id: 'us', label: 'United States' },
  { id: 'uk', label: 'United Kingdom' },
  { id: 'de', label: 'Germany' },
  { id: 'fr', label: 'France' },
  { id: 'jp', label: 'Japan' },
  { id: 'au', label: 'Australia' },
]

function onChange(value: string) {
  lastChanged.value = `Changed to: ${value}`
}
</script>

<template>
  <Story title="Select" icon="lucide:chevron-down" group="core">
    <Variant title="Default">
      <div style="width: 240px">
        <Select
          v-model="selected"
          :options="options"
          placeholder="Choose a country..."
          @change="onChange"
        />
        <div
          v-if="lastChanged"
          style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
        >
          {{ lastChanged }}
        </div>
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="width: 240px">
        <Select :model-value="'uk'" :options="options" disabled />
      </div>
    </Variant>

    <Variant title="Leading & Trailing Slots">
      <div style="width: 280px">
        <Select v-model="selected" :options="options" placeholder="Select country...">
          <template #leading>
            <span style="padding: 0 6px; color: var(--muted-foreground); font-size: 14px"
              >&#127758;</span
            >
          </template>
          <template #trailing>
            <span style="padding: 0 6px; color: var(--muted-foreground); font-size: 12px"
              >&#9660;</span
            >
          </template>
        </Select>
      </div>
    </Variant>

    <Variant title="With Disabled Options">
      <div style="width: 240px">
        <Select
          v-model="selected"
          :options="[
            { id: 'active', label: 'Active option' },
            { id: 'disabled', label: 'Disabled option', disabled: true },
            { id: 'another', label: 'Another option' },
          ]"
          placeholder="Some options are disabled..."
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 260px">
        <Select
          v-model="pgSelected"
          :options="options"
          :disabled="pgDisabled"
          :placeholder="pgPlaceholder"
        />
        <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
          Value: {{ pgSelected || '(none)' }}
        </div>
      </div>

      <template #controls>
        <HstText v-model="pgPlaceholder" title="Placeholder" />
        <HstCheckbox v-model="pgDisabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
