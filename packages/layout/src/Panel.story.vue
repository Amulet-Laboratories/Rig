<script setup lang="ts">
import Panel from './Panel.vue'
import { ref } from 'vue'

const open = ref(true)
const position = ref<'bottom' | 'right' | 'left'>('bottom')
const size = ref(200)
</script>

<template>
  <Story title="Panel" icon="lucide:panel-bottom" group="layout">
    <Variant title="Bottom Panel">
      <div
        style="position: relative; height: 400px; border: 1px solid var(--border); overflow: hidden"
      >
        <div style="padding: 12px; color: var(--foreground)">
          Main content area
          <button
            style="
              margin-left: 8px;
              padding: 4px 8px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
            "
            @click="open = !open"
          >
            Toggle Panel
          </button>
        </div>
        <Panel v-model:open="open" position="bottom">
          <template #header>Output</template>
          <div
            style="
              padding: 8px;
              color: var(--muted-foreground);
              font-family: monospace;
              font-size: 12px;
            "
          >
            Build succeeded in 1.2s
          </div>
        </Panel>
      </div>
    </Variant>

    <Variant title="Playground">
      <div
        style="position: relative; height: 400px; border: 1px solid var(--border); overflow: hidden"
      >
        <div style="padding: 12px; color: var(--foreground)">
          Main area
          <button
            style="
              margin-left: 8px;
              padding: 4px 8px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
            "
            @click="open = !open"
          >
            Toggle
          </button>
        </div>
        <Panel v-model:open="open" v-model:size="size" :position="position">
          <template #header>Panel</template>
          <div style="padding: 8px; color: var(--muted-foreground)">Panel content</div>
        </Panel>
      </div>

      <template #controls>
        <HstSelect v-model="position" title="Position" :options="['bottom', 'right', 'left']" />
        <HstSlider v-model="size" title="Size" :min="100" :max="400" />
        <HstCheckbox v-model="open" title="Open" />
      </template>
    </Variant>
  </Story>
</template>
