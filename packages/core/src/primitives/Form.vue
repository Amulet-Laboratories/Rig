<script setup lang="ts">
import { provide } from 'vue'
import {
  useFormValidation,
  FormContextKey,
  type FormValidationOptions,
  type FieldState,
} from '../composables/useFormValidation'

const props = withDefaults(
  defineProps<{
    /** Initial form values */
    initialValues: Record<string, unknown>
    /** Validation rules per field */
    rules?: Record<string, ((value: unknown) => string | undefined | Promise<string | undefined>)[]>
    /** Validate on value change instead of blur */
    validateOnChange?: boolean
    /** External schema validator */
    schema?: (
      values: Record<string, unknown>,
    ) => Record<string, string> | Promise<Record<string, string>>
  }>(),
  {
    validateOnChange: false,
  },
)

const emit = defineEmits<{
  submit: [values: Record<string, unknown>]
  'validation-error': [errors: Record<string, string | undefined>]
}>()

defineSlots<{
  default(props: {
    values: Record<string, unknown>
    fields: Record<string, FieldState>
    errors: Partial<Record<string, string>>
    isValid: boolean
    isDirty: boolean
    validate: () => Promise<boolean>
    reset: () => void
    fieldAttrs: (name: string) => { invalid: boolean; describedBy: string | undefined }
    setFieldValue: (name: string, value: unknown) => void
    setFieldTouched: (name: string) => void
  }): unknown
}>()

const form = useFormValidation({
  initialValues: props.initialValues,
  rules: props.rules,
  validateOnChange: props.validateOnChange,
  schema: props.schema,
} as FormValidationOptions<Record<string, unknown>>)

provide(FormContextKey, form)

async function onSubmit(e: Event) {
  e.preventDefault()
  const valid = await form.validate()
  if (valid) {
    emit('submit', form.values)
  } else {
    emit('validation-error', form.errors.value)
  }
}
</script>

<template>
  <form
    data-rig-form
    :data-valid="form.isValid.value || undefined"
    :data-dirty="form.isDirty.value || undefined"
    novalidate
    @submit="onSubmit"
  >
    <slot
      :values="form.values"
      :fields="form.fields"
      :errors="form.errors.value"
      :isValid="form.isValid.value"
      :isDirty="form.isDirty.value"
      :validate="form.validate"
      :reset="form.reset"
      :fieldAttrs="form.fieldAttrs"
      :setFieldValue="form.setFieldValue"
      :setFieldTouched="form.setFieldTouched"
    />
  </form>
</template>
