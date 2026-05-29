<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { Button } from '@core/primitives'

/**
 * Full-page crash screen — an app-level error boundary that shows a friendly
 * error overlay with "Try Again" and "Reload App" actions.
 *
 * Use this as the outermost error boundary wrapping your entire application.
 * For scoped feature-level error capture, use `ErrorBoundary` instead.
 */

const error = ref<Error | null>(null)
const errorInfo = ref('')

onErrorCaptured((err: Error, _instance, info: string) => {
  error.value = err
  errorInfo.value = info
  console.error('[CrashScreen]', err, info) // eslint-disable-line no-console
  return false
})

function reset() {
  error.value = null
  errorInfo.value = ''
}

function reload() {
  window.location.reload()
}
</script>

<template>
  <div v-if="error" data-rig-crash-screen role="alert">
    <div data-rig-crash-screen-content>
      <div data-rig-crash-screen-icon>&times;</div>
      <h2 data-rig-crash-screen-title>Something went wrong</h2>
      <p data-rig-crash-screen-message>{{ error.message }}</p>
      <details data-rig-crash-screen-details>
        <summary>Error details</summary>
        <pre
          >{{ error.stack }}
Lifecycle: {{ errorInfo }}</pre
        >
      </details>
      <div data-rig-crash-screen-actions>
        <Button variant="primary" size="sm" @click="reset"> Try Again </Button>
        <Button variant="ghost" size="sm" @click="reload"> Reload App </Button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>
