<script setup lang="ts">
import { useAnnounce } from '@core/composables/useAnnounce'

const { message } = useAnnounce()
</script>

<template>
  <div data-rig-live-region aria-live="polite" aria-atomic="true" role="status">
    {{ message }}
  </div>
</template>
