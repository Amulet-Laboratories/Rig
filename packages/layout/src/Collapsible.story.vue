<script setup lang="ts">
import Collapsible from './Collapsible.vue'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <Story title="Collapsible" icon="lucide:chevrons-down-up" group="layout">
    <Variant title="Default">
      <Collapsible v-model:open="open">
        <template #trigger="{ open: isOpen, toggle }">
          <button
            style="
              padding: 8px 12px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
              width: 100%;
            "
            @click="toggle"
          >
            {{ isOpen ? 'Collapse' : 'Expand' }} section
          </button>
        </template>
        <div
          style="
            padding: 12px;
            border: 1px solid var(--border);
            border-top: none;
            color: var(--foreground);
          "
        >
          Collapsible content goes here.
        </div>
      </Collapsible>
    </Variant>

    <Variant title="Initially Open">
      <Collapsible open>
        <template #trigger="{ open: isOpen, toggle }">
          <button
            style="
              padding: 8px 12px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
            "
            @click="toggle"
          >
            {{ isOpen ? 'Hide' : 'Show' }} details
          </button>
        </template>
        <div
          style="
            padding: 12px;
            border: 1px solid var(--border);
            border-top: none;
            color: var(--muted-foreground);
          "
        >
          This section starts open.
        </div>
      </Collapsible>
    </Variant>

    <Variant title="Disabled">
      <Collapsible :open="false" disabled>
        <template #trigger="{ toggle }">
          <button
            style="
              padding: 8px 12px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--muted-foreground);
              cursor: not-allowed;
              opacity: 0.5;
            "
            @click="toggle"
          >
            Disabled collapsible
          </button>
        </template>
        <div style="padding: 12px">Hidden content</div>
      </Collapsible>
    </Variant>
  </Story>
</template>
