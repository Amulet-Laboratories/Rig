<script setup lang="ts">
import Combobox from './Combobox.vue'
import { ref } from 'vue'

const selected = ref<string | null>(null)
const pgSelected = ref<string | null>(null)
const pgPlaceholder = ref('Search...')
const pgDisabled = ref(false)
const pgClearable = ref(true)

const options = [
  { id: 'vue', label: 'Vue', description: 'Progressive framework' },
  { id: 'react', label: 'React', description: 'UI library by Meta' },
  { id: 'angular', label: 'Angular', description: 'Platform by Google' },
  { id: 'svelte', label: 'Svelte', description: 'Compiled framework' },
  { id: 'solid', label: 'Solid', description: 'Fine-grained reactivity' },
]

const lastSelected = ref('')
function onSelect(option: { id: string; label: string }) {
  lastSelected.value = `Selected: ${option.label} (${option.id})`
}
</script>

<template>
  <Story title="Combobox" icon="lucide:search" group="core">
    <Variant title="Default">
      <div style="width: 280px">
        <Combobox
          v-model="selected"
          :options="options"
          placeholder="Pick a framework..."
          @select="onSelect"
        />
        <div
          v-if="lastSelected"
          style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
        >
          {{ lastSelected }}
        </div>
      </div>
    </Variant>

    <Variant title="Clearable">
      <div style="width: 280px">
        <Combobox v-model="selected" :options="options" clearable />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="width: 280px">
        <Combobox :model-value="'vue'" :options="options" disabled />
      </div>
    </Variant>

    <Variant title="Custom Option Slot">
      <div style="width: 320px">
        <Combobox v-model="selected" :options="options" placeholder="Custom rendering...">
          <template #option="{ option, highlighted }">
            <div style="display: flex; align-items: center; gap: 8px; width: 100%">
              <span
                style="width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0"
                :style="{ background: highlighted ? 'var(--primary)' : 'var(--muted-foreground)' }"
              />
              <div>
                <div style="font-weight: 600">{{ option.label }}</div>
                <div
                  v-if="option.description"
                  style="font-size: 11px; color: var(--muted-foreground)"
                >
                  {{ option.description }}
                </div>
              </div>
            </div>
          </template>
        </Combobox>
      </div>
    </Variant>

    <Variant title="Custom Empty Slot">
      <div style="width: 280px">
        <Combobox v-model="selected" :options="[]" placeholder="Type to search...">
          <template #empty>
            <div
              style="
                text-align: center;
                padding: 12px;
                color: var(--muted-foreground);
                font-size: 12px;
              "
            >
              No matching frameworks found. Try a different query.
            </div>
          </template>
        </Combobox>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 320px">
        <Combobox
          v-model="pgSelected"
          :options="options"
          :placeholder="pgPlaceholder"
          :disabled="pgDisabled"
          :clearable="pgClearable"
        />
        <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
          Value: {{ pgSelected ?? 'null' }}
        </div>
      </div>

      <template #controls>
        <HstText v-model="pgPlaceholder" title="Placeholder" />
        <HstCheckbox v-model="pgDisabled" title="Disabled" />
        <HstCheckbox v-model="pgClearable" title="Clearable" />
      </template>
    </Variant>
  </Story>
</template>
