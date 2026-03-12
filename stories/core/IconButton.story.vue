<script setup lang="ts">
import { ref } from 'vue'
import IconButton from '@core/primitives/IconButton.vue'
import type { Size } from '@core/types'
const size = ref<Size>('md')
const disabled = ref(false)
const loading = ref(false)
</script>

<template>
  <Story title="IconButton" icon="lucide:square">
    <template #controls>
      <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg', 'xl']" />
      <HstCheckbox v-model="disabled" title="Disabled" />
      <HstCheckbox v-model="loading" title="Loading" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; display: flex; gap: 8px">
        <IconButton ariaLabel="Search" icon="mdi:magnify" :size="size" :disabled="disabled" :loading="loading" />
        <IconButton ariaLabel="Settings" icon="mdi:cog" :size="size" :disabled="disabled" :loading="loading" />
        <IconButton ariaLabel="Delete" icon="mdi:delete" :size="size" :disabled="disabled" :loading="loading" />
      </div>
    </Variant>

    <Variant title="With Tooltip">
      <div style="padding: 24px; display: flex; gap: 8px">
        <IconButton ariaLabel="Copy" icon="mdi:content-copy" tooltip="Copy to clipboard" />
        <IconButton ariaLabel="Paste" icon="mdi:content-paste" tooltip="Paste" />
      </div>
    </Variant>
  </Story>
</template>
