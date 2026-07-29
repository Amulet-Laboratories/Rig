<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const { name: siteName } = useSiteConfig()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div data-rig-error-page>
    <div data-rig-error-content>
      <p data-rig-error-code>{{ error.statusCode }}</p>
      <h1 data-rig-error-title>
        {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p data-rig-error-message>
        {{
          error.statusCode === 404
            ? 'The page you are looking for does not exist or has been moved.'
            : 'An unexpected error occurred. Please try again.'
        }}
      </p>
      <Button variant="primary" @click="handleError"> Back to {{ siteName }} </Button>
    </div>
  </div>
</template>
