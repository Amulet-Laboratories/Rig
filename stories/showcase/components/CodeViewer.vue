<script setup lang="ts">
/**
 * CodeViewer — renders code with line numbers in a monospace pane.
 * Reusable across IDE-style showcases (MockVSCode, MockNotes, etc.).
 */
defineProps<{
  content: string
}>()

const emit = defineEmits<{
  contextmenu: [e: MouseEvent]
}>()
</script>

<template>
  <div class="showcase-code-area" @contextmenu="emit('contextmenu', $event)">
    <div class="showcase-gutter">
      <div
        v-for="(_line, i) in content.split('\n')"
        :key="i"
        class="showcase-line-number"
      >
        {{ i + 1 }}
      </div>
    </div>
    <pre class="showcase-code"><code>{{ content }}</code></pre>
  </div>
</template>
