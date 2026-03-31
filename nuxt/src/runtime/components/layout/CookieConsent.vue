<script setup lang="ts">
import { Button } from '@amulet-laboratories/rig'

const accepted = ref(true)

onMounted(() => {
  accepted.value = localStorage.getItem('cookie-consent') === 'accepted'
})

function accept() {
  localStorage.setItem('cookie-consent', 'accepted')
  accepted.value = true
}
</script>

<template>
  <div v-if="!accepted" data-rig-cookie-consent role="alert">
    <p data-rig-cookie-consent-text>
      We use cookies for analytics and to improve your experience.
      <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
    </p>
    <Button variant="primary" @click="accept"> Accept </Button>
  </div>
</template>
