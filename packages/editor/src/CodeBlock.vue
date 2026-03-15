<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Source code to display */
    code?: string
    /** Programming language (for accessibility, no runtime highlighting without peer dep) */
    language?: string
    /** Whether to show line numbers */
    showLineNumbers?: boolean
    /** Whether to show copy button */
    copyable?: boolean
  }>(),
  {
    code: '',
    language: 'text',
    showLineNumbers: true,
    copyable: true,
  },
)

const copied = ref(false)

const lines = computed(() => props.code.split('\n'))

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard API not available
  }
}
</script>

<template>
  <div data-rig-code-block :data-language="language" tabindex="0" @keydown.stop>
    <div data-rig-code-block-header>
      <span data-rig-code-block-language>{{ language }}</span>
      <button
        v-if="copyable"
        data-rig-code-block-copy
        type="button"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        :data-state="copied ? 'copied' : undefined"
        @click="copyToClipboard"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre
      data-rig-code-block-pre
    ><code data-rig-code-block-code><template v-for="(line, i) in lines" :key="i"><span v-if="showLineNumbers" data-rig-code-block-line-number>{{ i + 1 }}</span><span data-rig-code-block-line>{{ line }}</span>
</template></code></pre>
  </div>
</template>
