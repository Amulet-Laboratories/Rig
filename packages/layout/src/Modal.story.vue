<script setup lang="ts">
import Modal from './Modal.vue'
import { ref } from 'vue'

const open = ref(false)
const persistent = ref(false)
</script>

<template>
  <Story title="Modal" icon="lucide:app-window" group="layout">
    <Variant title="Default">
      <button
        style="
          padding: 8px 16px;
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          border-radius: 4px;
          cursor: pointer;
        "
        @click="open = true"
      >
        Open Modal
      </button>
      <Modal v-model:open="open" aria-label="Demo modal">
        <div
          style="
            padding: 24px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 8px;
            min-width: 320px;
            color: var(--foreground);
          "
        >
          <h3 style="margin: 0 0 12px 0">Modal Title</h3>
          <p style="color: var(--muted-foreground); margin: 0 0 16px 0">This is a modal dialog.</p>
          <button
            style="
              padding: 6px 12px;
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
            @click="open = false"
          >
            Close
          </button>
        </div>
      </Modal>
    </Variant>

    <Variant title="Playground">
      <button
        style="
          padding: 8px 16px;
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          border-radius: 4px;
          cursor: pointer;
        "
        @click="open = true"
      >
        Open Modal
      </button>
      <Modal v-model:open="open" :persistent="persistent" aria-label="Playground modal">
        <div
          style="
            padding: 24px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 8px;
            min-width: 320px;
            color: var(--foreground);
          "
        >
          <h3 style="margin: 0 0 12px 0">Playground Modal</h3>
          <p style="color: var(--muted-foreground); margin: 0 0 16px 0">
            {{
              persistent ? 'Click outside does nothing (persistent).' : 'Click outside to close.'
            }}
          </p>
          <button
            style="
              padding: 6px 12px;
              background: var(--primary);
              color: var(--primary-foreground);
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
            @click="open = false"
          >
            Close
          </button>
        </div>
      </Modal>

      <template #controls>
        <HstCheckbox v-model="persistent" title="Persistent" />
      </template>
    </Variant>
  </Story>
</template>
