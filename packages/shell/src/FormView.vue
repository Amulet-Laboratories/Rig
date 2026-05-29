<!--
  FormView — Generic form layout for settings, editors, and configuration panels.
  Provides structured sections with labeled fields and an action bar.
-->
<script setup lang="ts">
import { Button } from '@core/primitives'

defineProps<{
  /** Title shown at the top of the form */
  title?: string
  /** Whether save is in progress */
  saving?: boolean
  /** Whether to show the action bar (save/cancel) */
  showActions?: boolean
  /** Label for save button */
  saveLabel?: string
  /** Label for cancel button */
  cancelLabel?: string
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  close: []
}>()

defineSlots<{
  /** Form header — overrides default title + close button */
  header?: (props: Record<string, never>) => unknown
  /** Form body — sections and fields */
  default?: (props: Record<string, never>) => unknown
  /** Action bar — overrides default save/cancel buttons */
  actions?: (props: Record<string, never>) => unknown
}>()
</script>

<template>
  <div data-rig-form-view>
    <!-- Header -->
    <div v-if="$slots.header || title" data-rig-form-view-header>
      <slot name="header">
        <span data-rig-form-view-title>{{ title }}</span>
        <Button variant="ghost" size="sm" @click="emit('close')">Close</Button>
      </slot>
    </div>

    <!-- Body -->
    <div data-rig-form-view-body>
      <slot />
    </div>

    <!-- Actions -->
    <div v-if="showActions || $slots.actions" data-rig-form-view-actions>
      <slot name="actions">
        <Button variant="primary" size="sm" :disabled="saving" @click="emit('save')">
          {{ saving ? 'Saving...' : (saveLabel ?? 'Save') }}
        </Button>
        <Button variant="ghost" size="sm" :disabled="saving" @click="emit('cancel')">
          {{ cancelLabel ?? 'Cancel' }}
        </Button>
      </slot>
    </div>
  </div>
</template>
