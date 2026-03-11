<script setup lang="ts">
/**
 * TerminalEmulator — fake terminal with command input and canned responses.
 * Reusable across IDE-style and DevOps showcases.
 */
import { ref } from 'vue'

const props = defineProps<{
  lines: string[]
}>()

const emit = defineEmits<{
  execute: [command: string]
}>()

const input = ref('')

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    const cmd = input.value.trim()
    if (!cmd) return
    emit('execute', cmd)
    input.value = ''
  }
}
</script>

<template>
  <div class="showcase-terminal">
    <pre class="showcase-terminal-pre"><code>{{ props.lines.join('\n') }}</code></pre>
    <div class="showcase-terminal-input-line">
      <span class="showcase-prompt">$</span>
      <input
        v-model="input"
        class="showcase-terminal-input"
        type="text"
        spellcheck="false"
        @keydown="onKeydown"
      />
    </div>
  </div>
</template>
