<script setup lang="ts">
import { ref } from 'vue'
import TagInput from '@core/primitives/TagInput.vue'
const tags = ref(['vue', 'typescript', 'tailwind'])
const disabled = ref(false)
const max = ref(0)
</script>

<template>
  <Story title="TagInput" icon="lucide:tags">
    <template #controls>
      <HstNumber v-model="max" title="Max Tags (0=unlimited)" />
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 400px">
        <TagInput
          v-model="tags"
          :disabled="disabled"
          :max="max"
          :suggestions="['vite', 'vitest', 'pnpm', 'pinia', 'nuxt']"
          placeholder="Add a tag..."
        />
        <p style="margin-top: 8px; font-size: 12px">Tags: {{ tags.join(', ') }}</p>
      </div>
    </Variant>
  </Story>
</template>
