<script setup lang="ts">
import Popover from './Popover.vue'
import { ref } from 'vue'

const placement = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')
</script>

<template>
  <Story title="Popover" icon="lucide:message-square" group="layout">
    <Variant title="Default">
      <div style="padding: 60px; display: flex; justify-content: center">
        <Popover>
          <template #trigger="{ toggle }">
            <button
              style="
                padding: 8px 16px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="toggle"
            >
              Toggle Popover
            </button>
          </template>
          <div style="padding: 12px; min-width: 200px; color: var(--foreground)">
            <p style="margin: 0 0 8px 0; font-weight: 600">Popover Title</p>
            <p style="margin: 0; color: var(--muted-foreground); font-size: 13px">
              Some descriptive content.
            </p>
          </div>
        </Popover>
      </div>
    </Variant>

    <Variant title="Persistent">
      <div style="padding: 60px; display: flex; justify-content: center">
        <Popover persistent>
          <template #trigger="{ toggle }">
            <button
              style="
                padding: 8px 16px;
                background: var(--muted);
                color: var(--foreground);
                border: 1px solid var(--border);
                border-radius: 4px;
                cursor: pointer;
              "
              @click="toggle"
            >
              Persistent Popover
            </button>
          </template>
          <div style="padding: 12px; color: var(--foreground)">
            Click outside does nothing. Use the trigger to close.
          </div>
        </Popover>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="padding: 80px; display: flex; justify-content: center">
        <Popover :placement="placement">
          <template #trigger="{ toggle }">
            <button
              style="
                padding: 8px 16px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="toggle"
            >
              Open
            </button>
          </template>
          <div style="padding: 12px; color: var(--foreground)">Popover content</div>
        </Popover>
      </div>

      <template #controls>
        <HstSelect
          v-model="placement"
          title="Placement"
          :options="['top', 'bottom', 'left', 'right']"
        />
      </template>
    </Variant>
  </Story>
</template>
