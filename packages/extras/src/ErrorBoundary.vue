<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { Button } from '@core/primitives'

defineProps<{
  /** Short label shown in the error fallback, e.g. "Chat" or "Editor" */
  label?: string
}>()

const error = ref<Error | null>(null)
const errorInfo = ref('')

onErrorCaptured((err: Error, _instance, info: string) => {
  error.value = err
  errorInfo.value = info
  console.error('[ErrorBoundary]', err, info)
  return false
})

function retry() {
  error.value = null
  errorInfo.value = ''
}
</script>

<template>
  <div v-if="error" data-rig-error-boundary role="alert">
    <p data-rig-error-boundary-message>{{ label || 'Component' }} encountered an error</p>
    <details data-rig-error-boundary-details>
      <summary>{{ error.message }}</summary>
      <pre
        >{{ error.stack }}
Lifecycle: {{ errorInfo }}</pre
      >
    </details>
    <Button variant="ghost" size="sm" @click="retry"> Retry </Button>
  </div>
  <slot v-else />
</template>
