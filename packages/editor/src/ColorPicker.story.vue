<script setup lang="ts">
import ColorPicker from './ColorPicker.vue'
import { ref } from 'vue'

const color = ref('#c9956d')
const pgColor = ref('#c9956d')
</script>

<template>
  <Story title="ColorPicker" icon="lucide:palette" group="editor">
    <Variant title="Default">
      <ColorPicker v-model="color" />
      <div style="margin-top: 12px; color: var(--muted-foreground); font-size: 13px">
        Selected: {{ color }}
      </div>
    </Variant>

    <Variant title="Brand Colors">
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <div v-for="c in ['#c9956d', '#0f0d0a', '#f5f1ed', '#6d8fc9', '#22c55e']" :key="c">
          <ColorPicker :model-value="c" />
          <div
            style="
              text-align: center;
              font-size: 11px;
              color: var(--muted-foreground);
              margin-top: 4px;
            "
          >
            {{ c }}
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="display: flex; gap: 24px; align-items: flex-start">
        <ColorPicker v-model="pgColor" />
        <div>
          <div
            style="width: 80px; height: 80px; border-radius: 8px; border: 1px solid var(--border)"
            :style="{ backgroundColor: pgColor }"
          />
          <div
            style="
              margin-top: 8px;
              font-size: 12px;
              color: var(--muted-foreground);
              text-align: center;
            "
          >
            {{ pgColor }}
          </div>
        </div>
      </div>

      <template #controls>
        <HstText v-model="pgColor" title="Hex Color" />
      </template>
    </Variant>
  </Story>
</template>
