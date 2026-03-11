<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Collapsible from '@layout/Collapsible.vue'

const { theme, themeOptions } = useHexTheme()

const open = ref(false)
const disabled = ref(false)
</script>

<template>
  <Story title="Layout / Collapsible" icon="lucide:chevrons-down-up">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 400px">
        <Collapsible v-model:open="open" :disabled="disabled">
          <template #trigger="{ open: isOpen, toggle }">
            <button
              style="width: 100%; text-align: left; padding: 8px; cursor: pointer"
              @click="toggle"
            >
              {{ isOpen ? '▾' : '▸' }} Click to {{ isOpen ? 'collapse' : 'expand' }}
            </button>
          </template>
          <div style="padding: 8px 8px 8px 20px">
            <p>Collapsible content goes here.</p>
            <p>It can contain any elements.</p>
          </div>
        </Collapsible>
      </div>
    </Variant>
  </Story>
</template>
