<script setup lang="ts">
import Form from './Form.vue'
import Input from './Input.vue'
import Button from './Button.vue'
import { ref } from 'vue'

const submitResult = ref('')

const emailRules = [
  (v: unknown) => (!v ? 'Email is required' : undefined),
  (v: unknown) =>
    typeof v === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? 'Enter a valid email address'
      : undefined,
]

const passwordRules = [
  (v: unknown) => (!v ? 'Password is required' : undefined),
  (v: unknown) =>
    typeof v === 'string' && v.length < 8 ? 'Password must be at least 8 characters' : undefined,
]
</script>

<template>
  <Story title="Core/Form" icon="lucide:file-check" group="core">
    <Variant title="Basic Validation">
      <Form
        :initial-values="{ email: '', password: '' }"
        :rules="{ email: emailRules, password: passwordRules }"
        validate-on-change
        @submit="(values) => (submitResult = JSON.stringify(values))"
        @validation-error="() => {}"
      >
        <template #default="{ errors, fieldAttrs, setFieldValue, setFieldTouched }">
          <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px">
            <div>
              <label style="display: block; font-size: 12px; margin-bottom: 4px">Email</label>
              <Input
                placeholder="you@example.com"
                v-bind="fieldAttrs('email')"
                @update:model-value="(v: string | number) => setFieldValue('email', v)"
                @blur="() => setFieldTouched('email')"
              />
              <div
                v-if="errors.email"
                style="color: var(--rig-color-error, #ef4444); font-size: 12px; margin-top: 4px"
              >
                {{ errors.email }}
              </div>
            </div>
            <div>
              <label style="display: block; font-size: 12px; margin-bottom: 4px">Password</label>
              <Input
                type="password"
                placeholder="Min 8 characters"
                v-bind="fieldAttrs('password')"
                @update:model-value="(v: string | number) => setFieldValue('password', v)"
                @blur="() => setFieldTouched('password')"
              />
              <div
                v-if="errors.password"
                style="color: var(--rig-color-error, #ef4444); font-size: 12px; margin-top: 4px"
              >
                {{ errors.password }}
              </div>
            </div>
            <Button type="submit" variant="primary" @click="() => {}">Sign In</Button>
          </div>
        </template>
      </Form>
      <div
        v-if="submitResult"
        style="margin-top: 12px; font-size: 12px; color: var(--muted-foreground)"
      >
        Submitted: {{ submitResult }}
      </div>
    </Variant>

    <Variant title="Schema Integration">
      <div
        style="max-width: 320px; font-size: 13px; color: var(--muted-foreground); line-height: 1.6"
      >
        <p style="margin-bottom: 8px">
          The Form component accepts a <code>schema</code> prop for external validation libraries
          like Zod:
        </p>
        <pre
          style="
            background: var(--surface, #1a1a1a);
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
          "
        >
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// Pass as schema prop:
// &lt;Form :schema="zodAdapter(schema)" /&gt;</pre
        >
        <p style="margin-top: 8px">
          The schema function receives all form values and returns a record of field-name to
          error-message strings.
        </p>
      </div>
    </Variant>

    <Variant title="Submit Flow">
      <Form
        :initial-values="{ name: '', email: '' }"
        :rules="{
          name: [(v: unknown) => (!v ? 'Name is required' : undefined)],
          email: emailRules,
        }"
        @submit="(values) => (submitResult = 'Valid: ' + JSON.stringify(values))"
        @validation-error="() => (submitResult = 'Validation failed')"
      >
        <template
          #default="{ errors, isValid, isDirty, fieldAttrs, setFieldValue, setFieldTouched, reset }"
        >
          <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px">
            <div>
              <label style="display: block; font-size: 12px; margin-bottom: 4px">Name</label>
              <Input
                placeholder="Your name"
                v-bind="fieldAttrs('name')"
                @update:model-value="(v: string | number) => setFieldValue('name', v)"
                @blur="() => setFieldTouched('name')"
              />
              <div
                v-if="errors.name"
                style="color: var(--rig-color-error, #ef4444); font-size: 12px; margin-top: 4px"
              >
                {{ errors.name }}
              </div>
            </div>
            <div>
              <label style="display: block; font-size: 12px; margin-bottom: 4px">Email</label>
              <Input
                placeholder="you@example.com"
                v-bind="fieldAttrs('email')"
                @update:model-value="(v: string | number) => setFieldValue('email', v)"
                @blur="() => setFieldTouched('email')"
              />
              <div
                v-if="errors.email"
                style="color: var(--rig-color-error, #ef4444); font-size: 12px; margin-top: 4px"
              >
                {{ errors.email }}
              </div>
            </div>
            <div style="display: flex; gap: 8px">
              <Button type="submit" variant="primary" @click="() => {}">Submit</Button>
              <Button variant="ghost" @click="reset">Reset</Button>
            </div>
            <div style="font-size: 11px; color: var(--muted-foreground)">
              Valid: {{ isValid }} | Dirty: {{ isDirty }}
            </div>
          </div>
        </template>
      </Form>
      <div
        v-if="submitResult"
        style="margin-top: 12px; font-size: 12px; color: var(--muted-foreground)"
      >
        {{ submitResult }}
      </div>
    </Variant>
  </Story>
</template>
