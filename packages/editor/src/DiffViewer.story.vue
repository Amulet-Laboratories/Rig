<script setup lang="ts">
import DiffViewer from './DiffViewer.vue'
import { ref } from 'vue'

const mode = ref<'split' | 'unified'>('unified')

const original = `function greet(name) {
  console.log("Hello, " + name)
  return true
}

greet("World")`

const modified = `function greet(name: string) {
  console.log(\`Hello, \${name}\`)
  return name.length > 0
}

greet("Rig")`
</script>

<template>
  <Story title="DiffViewer" icon="lucide:diff" group="editor">
    <Variant title="Unified">
      <DiffViewer :original="original" :modified="modified" mode="unified" language="typescript" />
    </Variant>

    <Variant title="Split">
      <DiffViewer :original="original" :modified="modified" mode="split" language="typescript" />
    </Variant>

    <Variant title="Playground">
      <DiffViewer :original="original" :modified="modified" :mode="mode" language="typescript" />

      <template #controls>
        <HstSelect v-model="mode" title="Mode" :options="['unified', 'split']" />
      </template>
    </Variant>
  </Story>
</template>
