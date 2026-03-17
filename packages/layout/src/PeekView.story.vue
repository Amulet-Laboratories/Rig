<script setup lang="ts">
import PeekView from './PeekView.vue'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <Story title="PeekView" icon="lucide:eye" group="layout">
    <Variant title="Default">
      <div style="position: relative; min-height: 200px">
        <button
          style="
            padding: 8px 16px;
            background: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
          @click="open = !open"
        >
          {{ open ? 'Close' : 'Open' }} Peek View
        </button>
        <PeekView v-model:open="open" title="Definition Preview">
          <div
            style="padding: 12px; color: var(--foreground); font-family: monospace; font-size: 13px"
          >
            <div>export function greet(name: string) {</div>
            <div style="padding-left: 16px">return `Hello, ${'{'}name{'}'}`</div>
            <div>}</div>
          </div>
        </PeekView>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="position: relative; min-height: 200px">
        <button
          style="
            padding: 8px 16px;
            background: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
          @click="open = !open"
        >
          Toggle Peek
        </button>
        <PeekView v-model:open="open" title="Peek Preview">
          <div style="padding: 12px; color: var(--muted-foreground)">Peek content area</div>
        </PeekView>
      </div>

      <template #controls>
        <HstCheckbox v-model="open" title="Open" />
      </template>
    </Variant>
  </Story>
</template>
