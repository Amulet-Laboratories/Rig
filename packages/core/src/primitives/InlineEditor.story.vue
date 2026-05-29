<script setup lang="ts">
import InlineEditor from './InlineEditor.vue'
import { ref } from 'vue'

const text = ref('Double-click to edit')
const editing = ref(false)
</script>

<template>
  <Story title="InlineEditor" icon="lucide:pencil" group="core">
    <Variant title="Default">
      <InlineEditor v-model="text" v-model:editing="editing" />
    </Variant>

    <Variant title="Editing">
      <InlineEditor model-value="Currently editing" editing />
    </Variant>

    <Variant title="Playground">
      <InlineEditor v-model="text" v-model:editing="editing" />

      <template #controls>
        <HstCheckbox v-model="editing" title="Editing" />
      </template>
    </Variant>
  </Story>
</template>
