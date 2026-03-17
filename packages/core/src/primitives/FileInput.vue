<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Accepted file types (e.g. 'image/*,.pdf') */
    accept?: string
    /** Allow multiple files */
    multiple?: boolean
    /** Whether the input is disabled */
    disabled?: boolean
    /** Maximum file size in bytes (0 = no limit) */
    maxSize?: number
    /** Placeholder text when no file is selected */
    placeholder?: string
  }>(),
  {
    accept: '',
    multiple: false,
    disabled: false,
    maxSize: 0,
    placeholder: 'Choose a file or drag and drop',
  },
)

const emit = defineEmits<{
  change: [files: File[]]
  error: [err: { type: 'size' | 'type'; file: File; message: string }]
}>()

defineSlots<{
  default?: (props: { files: File[]; dragging: boolean; open: () => void }) => unknown
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const dragging = ref(false)

function openFilePicker() {
  inputRef.value?.click()
}

function validateAndEmit(incoming: File[]) {
  const valid: File[] = []
  for (const file of incoming) {
    if (props.maxSize > 0 && file.size > props.maxSize) {
      emit('error', { type: 'size', file, message: `${file.name} exceeds max size` })
      continue
    }
    valid.push(file)
  }
  files.value = valid
  emit('change', valid)
}

function onInputChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    validateAndEmit(Array.from(input.files))
  }
  // Reset so the same file can be re-selected
  input.value = ''
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  if (props.disabled || !e.dataTransfer?.files.length) return
  validateAndEmit(Array.from(e.dataTransfer.files))
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (!props.disabled) dragging.value = true
}

function onDragLeave() {
  dragging.value = false
}
</script>

<template>
  <div
    data-rig-file-input
    :data-disabled="disabled || undefined"
    :data-dragging="dragging || undefined"
    :data-has-files="files.length > 0 || undefined"
    role="button"
    tabindex="0"
    :aria-disabled="disabled || undefined"
    @click="openFilePicker"
    @keydown.enter.prevent="openFilePicker"
    @keydown.space.prevent="openFilePicker"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
  >
    <input
      ref="inputRef"
      data-rig-file-input-native
      type="file"
      :accept="accept || undefined"
      :multiple="multiple"
      :disabled="disabled"
      tabindex="-1"
      aria-hidden="true"
      @change="onInputChange"
    />
    <slot :files="files" :dragging="dragging" :open="openFilePicker">
      <div data-rig-file-input-content>
        <span v-if="files.length === 0" data-rig-file-input-placeholder>{{ placeholder }}</span>
        <span v-else data-rig-file-input-files>
          {{ files.map((f) => f.name).join(', ') }}
        </span>
      </div>
    </slot>
  </div>
</template>
