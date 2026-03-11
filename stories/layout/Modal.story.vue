<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Modal from '@layout/Modal.vue'
import Button from '@core/primitives/Button.vue'

const { theme, themeOptions } = useHexTheme()

const open = ref(false)
const persistent = ref(false)
</script>

<template>
  <Story title="Layout / Modal" icon="lucide:panel-top">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstCheckbox v-model="persistent" title="Persistent (no outside click)" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px">
        <Button @click="open = true">Open Modal</Button>
        <Modal v-model:open="open" :persistent="persistent" aria-label="Example modal">
          <div style="padding: 24px; max-width: 400px">
            <h2 style="margin-bottom: 12px; font-size: 18px; font-weight: 600">Modal Title</h2>
            <p style="margin-bottom: 16px">This is the modal body content. Click outside or press Escape to close.</p>
            <Button @click="open = false">Close</Button>
          </div>
        </Modal>
      </div>
    </Variant>
  </Story>
</template>
