<script setup lang="ts">
import { ref } from 'vue'
import InlineEditor from '@core/primitives/InlineEditor.vue'
const text = ref('Double-click to edit')
const editing = ref(false)
</script>

<template>
  <Story title="InlineEditor" icon="lucide:pencil">
        <Variant title="Interactive">
      <div style="padding: 24px">
        <p style="margin-bottom: 8px; font-size: 12px">Double-click the text below to edit:</p>
        <InlineEditor v-model="text" v-model:editing="editing" />
        <p style="margin-top: 8px; font-size: 12px">Editing: {{ editing }}</p>
      </div>
    </Variant>
  </Story>
</template>
