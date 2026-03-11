<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Textarea from '@core/primitives/Textarea.vue'

const { theme, themeOptions } = useHexTheme()

const value = ref('')
const placeholder = ref('Write something...')
const disabled = ref(false)
const rows = ref(4)
const resize = ref<'none' | 'vertical' | 'horizontal' | 'both'>('vertical')
const maxlength = ref(0)
</script>

<template>
  <Story title="Core / Textarea" icon="lucide:align-left">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstText v-model="placeholder" title="Placeholder" />
      <HstNumber v-model="rows" title="Rows" />
      <HstSelect
        v-model="resize"
        title="Resize"
        :options="['none', 'vertical', 'horizontal', 'both']"
      />
      <HstNumber v-model="maxlength" title="Max Length (0=none)" />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 400px">
        <Textarea
          v-model="value"
          :placeholder="placeholder"
          :disabled="disabled"
          :rows="rows"
          :resize="resize"
          :maxlength="maxlength"
        />
      </div>
    </Variant>
  </Story>
</template>
