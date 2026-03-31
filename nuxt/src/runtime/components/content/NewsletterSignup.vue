<script setup lang="ts">
import { useFathom } from '@amulet-laboratories/rig'

const props = defineProps<{
  heading?: string
  description?: string
}>()

const { name: siteName } = useSiteConfig()

const formRef = ref<{ onSuccess: () => void; onError: () => void } | null>(null)
const { trackNewsletterSignup } = useFathom()

async function handleSubscribe(email: string) {
  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email },
    })
    trackNewsletterSignup('article')
    formRef.value?.onSuccess()
  } catch {
    formRef.value?.onError()
  }
}
</script>

<template>
  <NewsletterForm
    ref="formRef"
    placeholder="you@example.com"
    button-text="Subscribe"
    success-message="Thanks for subscribing. Check your inbox to confirm."
    @subscribe="handleSubscribe"
  >
    <h2 data-rig-newsletter-heading>{{ heading || 'Never miss a great read' }}</h2>
    <p data-rig-newsletter-description>
      {{
        description ||
        `Curated picks, honest reviews, and expert tips delivered weekly. Join readers who trust ${siteName}.`
      }}
    </p>
  </NewsletterForm>
</template>
