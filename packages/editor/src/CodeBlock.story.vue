<script setup lang="ts">
import CodeBlock from './CodeBlock.vue'
import { ref } from 'vue'

const language = ref('typescript')
const showLineNumbers = ref(true)
const copyable = ref(true)

const tsCode = `import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    return { count, increment }
  },
})`

const cssCode = `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
}`
</script>

<template>
  <Story title="CodeBlock" icon="lucide:code" group="editor">
    <Variant title="TypeScript">
      <CodeBlock :code="tsCode" language="typescript" />
    </Variant>

    <Variant title="CSS">
      <CodeBlock :code="cssCode" language="css" />
    </Variant>

    <Variant title="No Line Numbers">
      <CodeBlock :code="tsCode" language="typescript" :show-line-numbers="false" />
    </Variant>

    <Variant title="Playground">
      <CodeBlock
        :code="tsCode"
        :language="language"
        :show-line-numbers="showLineNumbers"
        :copyable="copyable"
      />

      <template #controls>
        <HstSelect
          v-model="language"
          title="Language"
          :options="['typescript', 'javascript', 'css', 'html', 'text']"
        />
        <HstCheckbox v-model="showLineNumbers" title="Line Numbers" />
        <HstCheckbox v-model="copyable" title="Copyable" />
      </template>
    </Variant>
  </Story>
</template>
