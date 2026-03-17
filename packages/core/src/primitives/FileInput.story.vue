<script setup lang="ts">
import FileInput from './FileInput.vue'
import { ref } from 'vue'

const accept = ref('')
const multiple = ref(false)
const disabled = ref(false)
const placeholder = ref('Choose a file or drag and drop')
const maxSize = ref(0)
const lastFiles = ref<string[]>([])

function onFileChange(files: File[]) {
  lastFiles.value = files.map((f) => f.name)
}
</script>

<template>
  <Story title="FileInput" icon="lucide:upload" group="core">
    <Variant title="Default">
      <FileInput @change="onFileChange" />
      <div
        v-if="lastFiles.length"
        style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px"
      >
        Selected: {{ lastFiles.join(', ') }}
      </div>
    </Variant>

    <Variant title="Accept Images">
      <FileInput accept="image/*" placeholder="Choose an image" @change="onFileChange" />
    </Variant>

    <Variant title="Multiple">
      <FileInput multiple placeholder="Choose files (multiple)" @change="onFileChange" />
    </Variant>

    <Variant title="Disabled">
      <FileInput disabled />
    </Variant>

    <Variant title="Playground">
      <FileInput
        :accept="accept || undefined"
        :multiple="multiple"
        :disabled="disabled"
        :placeholder="placeholder"
        :max-size="maxSize"
        @change="onFileChange"
      />
      <div
        v-if="lastFiles.length"
        style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px"
      >
        Selected: {{ lastFiles.join(', ') }}
      </div>

      <template #controls>
        <HstText v-model="accept" title="Accept" />
        <HstCheckbox v-model="multiple" title="Multiple" />
        <HstCheckbox v-model="disabled" title="Disabled" />
        <HstText v-model="placeholder" title="Placeholder" />
        <HstSlider
          v-model="maxSize"
          title="Max Size (bytes)"
          :min="0"
          :max="10000000"
          :step="100000"
        />
      </template>
    </Variant>
  </Story>
</template>
