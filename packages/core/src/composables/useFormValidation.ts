import { reactive, computed, type InjectionKey } from 'vue'

/**
 * Validation rule — a function that returns an error message or undefined.
 */
export type ValidationRule<T = unknown> = (
  value: T,
) => string | undefined | Promise<string | undefined>

/**
 * Field-level validation state.
 */
export interface FieldState {
  /** Whether the field has been touched (blurred at least once) */
  touched: boolean
  /** Whether the field value has been modified */
  dirty: boolean
  /** Current error message (undefined = valid) */
  error: string | undefined
  /** Whether async validation is in progress */
  validating: boolean
}

/**
 * Options for useFormValidation.
 */
export interface FormValidationOptions<T extends Record<string, unknown>> {
  /** Initial form values */
  initialValues: T
  /** Validation rules per field */
  rules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>>
  /** Validate on value change (default: false — validates on blur) */
  validateOnChange?: boolean
  /**
   * External schema validator (e.g. Zod, Valibot).
   * Called with the full form values; should return a map of field → error message.
   */
  schema?: (values: T) => Record<string, string> | Promise<Record<string, string>>
}

/**
 * Form validation composable.
 *
 * Provides reactive form state, field-level validation, and integration
 * points for external schema validators (Zod, Valibot, vee-validate).
 *
 * @example
 * ```ts
 * const { values, fields, validate, handleSubmit } = useFormValidation({
 *   initialValues: { email: '', password: '' },
 *   rules: {
 *     email: [(v) => !v ? 'Required' : undefined],
 *     password: [(v) => (v as string).length < 8 ? 'Too short' : undefined],
 *   },
 * })
 * ```
 */
export function useFormValidation<T extends Record<string, unknown>>(
  options: FormValidationOptions<T>,
) {
  const values = reactive({ ...options.initialValues }) as T
  const fieldStates = reactive<Record<string, FieldState>>({})

  // Initialize field states
  for (const key of Object.keys(options.initialValues)) {
    fieldStates[key] = {
      touched: false,
      dirty: false,
      error: undefined,
      validating: false,
    }
  }

  const isValid = computed(() => Object.values(fieldStates).every((f) => !(f as FieldState).error))

  const isDirty = computed(() => Object.values(fieldStates).some((f) => (f as FieldState).dirty))

  const errors = computed(() => {
    const result: Partial<Record<keyof T, string>> = {}
    for (const [key, state] of Object.entries(fieldStates)) {
      if ((state as FieldState).error) {
        result[key as keyof T] = (state as FieldState).error
      }
    }
    return result
  })

  async function validateField(name: keyof T): Promise<string | undefined> {
    const field = fieldStates[name as string]
    if (!field) return undefined

    const fieldState = field as FieldState
    fieldState.validating = true

    try {
      // Run field-level rules
      const rules = options.rules?.[name] ?? []
      for (const rule of rules) {
        const error = await rule(values[name])
        if (error) {
          fieldState.error = error
          return error
        }
      }

      // Run schema validation if provided
      if (options.schema) {
        const schemaErrors = await options.schema(values)
        const fieldError = schemaErrors[name as string]
        if (fieldError) {
          fieldState.error = fieldError
          return fieldError
        }
      }

      fieldState.error = undefined
      return undefined
    } finally {
      fieldState.validating = false
    }
  }

  async function validate(): Promise<boolean> {
    const results = await Promise.all(
      Object.keys(options.initialValues).map((key) => validateField(key as keyof T)),
    )
    return results.every((r) => r === undefined)
  }

  function setFieldValue<K extends keyof T>(name: K, value: T[K]) {
    values[name] = value
    const field = fieldStates[name as string] as FieldState | undefined
    if (field) {
      field.dirty = true
      if (options.validateOnChange) {
        validateField(name)
      }
    }
  }

  function setFieldTouched(name: keyof T) {
    const field = fieldStates[name as string] as FieldState | undefined
    if (field) {
      field.touched = true
      validateField(name)
    }
  }

  function setFieldError(name: keyof T, error: string | undefined) {
    const field = fieldStates[name as string] as FieldState | undefined
    if (field) {
      field.error = error
    }
  }

  function reset() {
    Object.assign(values, options.initialValues)
    for (const key of Object.keys(fieldStates)) {
      const field = fieldStates[key] as FieldState
      field.touched = false
      field.dirty = false
      field.error = undefined
      field.validating = false
    }
  }

  function handleSubmit(onValid: (values: T) => void | Promise<void>) {
    return async (e?: Event) => {
      e?.preventDefault()
      const valid = await validate()
      if (valid) {
        await onValid(values)
      }
    }
  }

  /**
   * Get ARIA attributes for a field — wire directly to Rig form components.
   *
   * @example
   * ```vue
   * <Input v-bind="fieldAttrs('email')" v-model="values.email" />
   * ```
   */
  function fieldAttrs(name: keyof T) {
    const field = fieldStates[name as string] as FieldState | undefined
    return {
      invalid: !!field?.error,
      describedBy: field?.error ? `${String(name)}-error` : undefined,
    }
  }

  return {
    values,
    fields: fieldStates as Record<keyof T & string, FieldState>,
    errors,
    isValid,
    isDirty,
    validate,
    validateField,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    reset,
    handleSubmit,
    fieldAttrs,
  }
}

/** Injection key for Form component — allows child fields to access form state */
export const FormContextKey: InjectionKey<ReturnType<typeof useFormValidation>> = Symbol('rig-form')
