<script setup lang="ts">
/**
 * NewsletterForm — inline email subscribe form for marketing sites.
 *
 * Renders an email input + submit button in a single row. Includes
 * built-in email validation, honeypot spam prevention, and a
 * success/error state. Submission is delegated to the consumer via @subscribe.
 *
 * Slots:
 *   #default  — prepend content (heading, description)
 *   #success  — custom success message after subscription
 */
import { ref } from 'vue'
import { Input, Button } from '@core/primitives'

withDefaults(
  defineProps<{
    /** Placeholder text for the email input. */
    placeholder?: string
    /** Submit button text. */
    buttonText?: string
    /** Message shown after successful subscription. */
    successMessage?: string
    /** Include a honeypot field for spam prevention. */
    honeypot?: boolean
  }>(),
  {
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
    successMessage: 'Thanks for subscribing.',
    honeypot: false,
  },
)

const emit = defineEmits<{
  /** Fired with the email address when the form is submitted. */
  subscribe: [email: string]
}>()

const email = ref('')
const submitted = ref(false)
const submitting = ref(false)
const error = ref(false)

function handleSubmit() {
  if (submitting.value || !email.value.trim()) return
  submitting.value = true
  error.value = false
  emit('subscribe', email.value.trim())
}

/** Called by consumer to indicate successful subscription. */
function onSuccess() {
  submitting.value = false
  submitted.value = true
}

/** Called by consumer to indicate failed subscription. */
function onError() {
  submitting.value = false
  error.value = true
}

defineExpose({ onSuccess, onError })
</script>

<template>
  <div data-rig-newsletter-form>
    <slot />

    <div v-if="submitted" data-rig-newsletter-form-success role="status" aria-live="polite">
      <slot name="success">
        <p>{{ successMessage }}</p>
      </slot>
    </div>

    <form v-else novalidate data-rig-newsletter-form-body @submit.prevent="handleSubmit">
      <div v-if="honeypot" aria-hidden="true" style="position: absolute; left: -9999px">
        <input name="bot-field" tabindex="-1" autocomplete="off" />
      </div>

      <Input
        v-model="email"
        type="email"
        name="email"
        required
        autocomplete="email"
        :placeholder="placeholder"
        aria-label="Email address"
      />

      <Button type="submit" variant="cta" :disabled="submitting" :loading="submitting">
        {{ submitting ? 'Sending...' : buttonText }}
      </Button>
    </form>

    <p v-if="error" data-rig-newsletter-form-error role="alert">
      Something went wrong. Please try again.
    </p>
  </div>
</template>
