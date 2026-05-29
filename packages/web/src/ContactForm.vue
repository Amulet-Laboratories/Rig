<script setup lang="ts">
/**
 * ContactForm — generic contact form with validation and accessible errors.
 *
 * Ships with sensible defaults (name, email, message) but fully customizable
 * via the `fields` prop. Submission is delegated to the consumer via @submit.
 *
 * Features:
 *   - Field validation with touched-state tracking
 *   - Accessible inline errors via aria-describedby
 *   - Honeypot field for spam prevention
 *   - Cooldown after failed submission attempts
 *   - Success/error states with slot overrides
 *
 * Slots:
 *   #success  — custom success message after submission
 *   #error    — custom error message (receives { retry } function)
 *   #field    — custom field rendering (receives { field, modelValue, error, touched })
 *   #actions  — custom submit area (receives { submitting, canSubmit })
 */
import { ref, computed, reactive } from 'vue'
import { Input, Textarea, Button } from '@core/primitives'

export interface ContactFormField {
  /** Field key (used as name attribute). */
  name: string
  /** Display label. */
  label: string
  /** Input type. */
  type?: 'text' | 'email' | 'tel' | 'textarea'
  /** Placeholder text. */
  placeholder?: string
  /** Whether the field is required. */
  required?: boolean
  /** Autocomplete hint. */
  autocomplete?: string
  /** Max character length. */
  maxlength?: number
  /** Rows for textarea. */
  rows?: number
}

const props = withDefaults(
  defineProps<{
    /** Form name (used as hidden field value for services like Netlify). */
    formName?: string
    /** Field definitions. */
    fields?: ContactFormField[]
    /** Submit button text. */
    submitLabel?: string
    /** Submitting button text. */
    submittingLabel?: string
    /** Include a honeypot field for spam prevention. */
    honeypot?: boolean
    /** Cooldown duration in ms after failed submission. */
    cooldownMs?: number
  }>(),
  {
    formName: 'contact',
    fields: () => [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        autocomplete: 'name',
        maxlength: 200,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        autocomplete: 'email',
        maxlength: 320,
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Tell us about your project.',
        maxlength: 2000,
        rows: 4,
      },
    ],
    submitLabel: 'Send message',
    submittingLabel: 'Sending...',
    honeypot: false,
    cooldownMs: 5000,
  },
)

const emit = defineEmits<{
  /** Fired with field values when the form passes validation. Consumer handles actual submission. */
  submit: [values: Record<string, string>]
}>()

const values = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})
const submitted = ref(false)
const submitting = ref(false)
const error = ref(false)
const cooldown = ref(false)

// Initialize values for all fields
for (const field of props.fields) {
  values[field.name] = ''
  touched[field.name] = false
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getFieldError(field: ContactFormField): string {
  if (!touched[field.name]) return ''
  const val = values[field.name]?.trim() ?? ''
  if (field.required && !val) return `Please enter your ${field.label.toLowerCase()}.`
  if (field.type === 'email' && val && !emailRegex.test(val))
    return 'Please enter a valid email address.'
  return ''
}

const canSubmit = computed(() => {
  if (submitting.value || cooldown.value) return false
  return props.fields.every((f) => {
    const val = values[f.name]?.trim() ?? ''
    if (f.required && !val) return false
    if (f.type === 'email' && val && !emailRegex.test(val)) return false
    return true
  })
})

function handleSubmit() {
  if (submitting.value) return

  // Mark all fields as touched
  for (const field of props.fields) {
    touched[field.name] = true
  }

  if (!canSubmit.value) return

  submitting.value = true
  error.value = false

  const result: Record<string, string> = {}
  for (const field of props.fields) {
    result[field.name] = values[field.name] ?? ''
  }

  emit('submit', result)
}

/** Called by consumer to indicate successful submission. */
function onSuccess() {
  submitting.value = false
  submitted.value = true
}

/** Called by consumer to indicate failed submission. */
function onError() {
  submitting.value = false
  error.value = true
  cooldown.value = true
  setTimeout(() => (cooldown.value = false), props.cooldownMs)
}

function retry() {
  error.value = false
}

defineExpose({ onSuccess, onError })
</script>

<template>
  <div data-rig-contact-form>
    <div v-if="submitted" data-rig-contact-form-success role="status" aria-live="polite">
      <slot name="success">
        <p>Message sent.</p>
      </slot>
    </div>

    <form
      v-else
      :name="formName"
      method="POST"
      novalidate
      data-rig-contact-form-body
      @submit.prevent="handleSubmit"
    >
      <input v-if="formName" type="hidden" name="form-name" :value="formName" />

      <div v-if="honeypot" aria-hidden="true" style="position: absolute; left: -9999px">
        <input name="bot-field" tabindex="-1" autocomplete="off" />
      </div>

      <div v-if="error" data-rig-contact-form-error role="alert">
        <slot name="error" :retry="retry">
          <p>Something went wrong. Please try again.</p>
        </slot>
      </div>

      <div v-for="field in fields" :key="field.name" data-rig-contact-form-field>
        <slot
          name="field"
          :field="field"
          :model-value="values[field.name]"
          :error="getFieldError(field)"
          :touched="touched[field.name]"
        >
          <label :for="`${formName}-${field.name}`" data-rig-contact-form-label>
            {{ field.label }}
          </label>

          <Textarea
            v-if="field.type === 'textarea'"
            :id="`${formName}-${field.name}`"
            v-model="values[field.name]"
            :name="field.name"
            :required="field.required"
            :maxlength="field.maxlength"
            :placeholder="field.placeholder"
            :rows="field.rows ?? 4"
            resize="none"
            :invalid="!!getFieldError(field)"
            :described-by="getFieldError(field) ? `${formName}-${field.name}-error` : undefined"
            @blur="touched[field.name] = true"
          />
          <Input
            v-else
            :id="`${formName}-${field.name}`"
            v-model="values[field.name]"
            :type="field.type ?? 'text'"
            :name="field.name"
            :required="field.required"
            :maxlength="field.maxlength"
            :autocomplete="field.autocomplete"
            :placeholder="field.placeholder"
            :invalid="!!getFieldError(field)"
            :described-by="getFieldError(field) ? `${formName}-${field.name}-error` : undefined"
            @blur="touched[field.name] = true"
          />

          <p
            v-if="getFieldError(field)"
            :id="`${formName}-${field.name}-error`"
            data-rig-contact-form-field-error
            role="alert"
          >
            {{ getFieldError(field) }}
          </p>
        </slot>
      </div>

      <div data-rig-contact-form-actions>
        <slot name="actions" :submitting="submitting" :can-submit="canSubmit">
          <Button type="submit" variant="cta" :disabled="submitting" :loading="submitting">
            {{ submitting ? submittingLabel : submitLabel }}
          </Button>
        </slot>
      </div>
    </form>
  </div>
</template>
