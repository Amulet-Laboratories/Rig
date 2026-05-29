<script setup lang="ts">
import TagInput from './TagInput.vue'
import { ref } from 'vue'

const tags = ref(['vue', 'typescript', 'vite'])
const disabled = ref(false)

const suggestions = [
  'vue',
  'react',
  'angular',
  'svelte',
  'typescript',
  'javascript',
  'vite',
  'webpack',
]
</script>

<template>
  <Story title="TagInput" icon="lucide:tags" group="core">
    <Variant title="Default">
      <div style="width: 320px">
        <TagInput v-model="tags" placeholder="Add tag..." />
      </div>
    </Variant>

    <Variant title="With Suggestions">
      <div style="width: 320px">
        <TagInput v-model="tags" :suggestions="suggestions" placeholder="Type to autocomplete..." />
      </div>
    </Variant>

    <Variant title="Max Tags">
      <div style="width: 320px">
        <TagInput v-model="tags" :max="5" placeholder="Max 5 tags" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="width: 320px">
        <TagInput :model-value="['readonly', 'tags']" disabled />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 320px">
        <TagInput
          v-model="tags"
          :suggestions="suggestions"
          :disabled="disabled"
          placeholder="Add tag..."
          aria-label="Tags"
        />
      </div>

      <template #controls>
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
