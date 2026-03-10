<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    /** The current text value */
    modelValue?: string
    /** Whether the editor is in edit mode */
    editing?: boolean
  }>(),
  {
    modelValue: '',
    editing: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:editing': [value: boolean]
  submit: [value: string]
  cancel: []
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const localValue = ref(props.modelValue)

function startEditing() {
  localValue.value = props.modelValue
  emit('update:editing', true)
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function submit() {
  if (!props.editing) return
  emit('update:modelValue', localValue.value)
  emit('submit', localValue.value)
  emit('update:editing', false)
}

function cancel() {
  localValue.value = props.modelValue
  emit('cancel')
  emit('update:editing', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    submit()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancel()
  }
}
</script>

<template>
  <div data-rig-inline-editor :data-editing="editing || undefined">
    <input
      v-if="editing"
      ref="inputRef"
      v-model="localValue"
      data-rig-inline-editor-input
      @keydown="onKeydown"
      @blur="submit"
    />
    <span
      v-else
      data-rig-inline-editor-display
      tabindex="0"
      @dblclick="startEditing"
      @keydown.enter.prevent="startEditing"
    >
      <slot>{{ modelValue }}</slot>
    </span>
  </div>
</template>
