<script setup lang="ts">
import Divider from './Divider.vue'
import { ref } from 'vue'

const pgVertical = ref(false)
const pgLabel = ref('')
</script>

<template>
  <Story title="Divider" icon="lucide:minus" group="core">
    <Variant title="Horizontal">
      <div style="color: var(--foreground)">
        <p>Content above</p>
        <Divider />
        <p>Content below</p>
      </div>
    </Variant>

    <Variant title="With Label">
      <div style="color: var(--foreground)">
        <p>Section A</p>
        <Divider label="OR" />
        <p>Section B</p>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div
        style="
          display: flex;
          gap: 12px;
          align-items: center;
          height: 40px;
          color: var(--foreground);
        "
      >
        <span>Left</span>
        <Divider vertical />
        <span>Right</span>
      </div>
    </Variant>

    <Variant title="Playground">
      <div
        :style="
          pgVertical
            ? {
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                height: '80px',
                color: 'var(--foreground)',
              }
            : { color: 'var(--foreground)' }
        "
      >
        <span>Before</span>
        <Divider :vertical="pgVertical" :label="pgLabel || undefined" />
        <span>After</span>
      </div>

      <template #controls>
        <HstCheckbox v-model="pgVertical" title="Vertical" />
        <HstText v-model="pgLabel" title="Label" />
      </template>
    </Variant>
  </Story>
</template>
