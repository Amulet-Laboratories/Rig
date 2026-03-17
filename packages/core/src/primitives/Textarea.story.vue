<script setup lang="ts">
import Textarea from './Textarea.vue'
import { ref } from 'vue'

const text = ref('')
const disabled = ref(false)
const resize = ref<'none' | 'vertical' | 'horizontal' | 'both'>('vertical')
</script>

<template>
  <Story title="Textarea" icon="lucide:text" group="core">
    <Variant title="Default">
      <div style="width: 320px">
        <Textarea v-model="text" placeholder="Write something..." />
      </div>
    </Variant>

    <Variant title="Custom Rows">
      <div style="width: 320px">
        <Textarea v-model="text" :rows="8" placeholder="Tall textarea..." />
      </div>
    </Variant>

    <Variant title="With Max Length">
      <div style="width: 320px">
        <Textarea v-model="text" :maxlength="140" placeholder="Max 140 characters..." />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="width: 320px">
        <Textarea model-value="Read only content" disabled />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="width: 320px">
        <Textarea
          v-model="text"
          :disabled="disabled"
          :resize="resize"
          placeholder="Playground..."
          aria-label="Playground textarea"
        />
      </div>

      <template #controls>
        <HstSelect
          v-model="resize"
          title="Resize"
          :options="['none', 'vertical', 'horizontal', 'both']"
        />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
