<script setup lang="ts">
import { ref } from 'vue'
import Divider from '@core/primitives/Divider.vue'
const vertical = ref(false)
const label = ref('')
</script>

<template>
  <Story title="Divider" icon="lucide:minus">
    <template #controls>
      <HstCheckbox v-model="vertical" title="Vertical" />
      <HstText v-model="label" title="Label" />
    </template>

    <Variant title="Horizontal">
      <div style="padding: 24px; max-width: 400px">
        <p style="margin-bottom: 8px">Content above</p>
        <Divider :label="label || undefined" />
        <p style="margin-top: 8px">Content below</p>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="padding: 24px; display: flex; gap: 0; align-items: center; height: 60px">
        <span>Left</span>
        <Divider vertical />
        <span>Right</span>
      </div>
    </Variant>

    <Variant title="With Label">
      <div style="padding: 24px; max-width: 400px">
        <Divider label="OR" />
      </div>
    </Variant>
  </Story>
</template>
