<script setup lang="ts">
import Popconfirm from './Popconfirm.vue'
import { ref } from 'vue'

const defaultOpen = ref(false)
const customOpen = ref(false)
const playgroundOpen = ref(false)

const title = ref('Are you sure?')
const confirmLabel = ref('Confirm')
const cancelLabel = ref('Cancel')
const lastAction = ref('')
</script>

<template>
  <Story title="Extras/Popconfirm" icon="lucide:circle-alert" group="extras">
    <Variant title="Default">
      <Popconfirm
        v-model:open="defaultOpen"
        title="Delete this item?"
        @confirm="() => {}"
        @cancel="() => {}"
      >
        <template #trigger>
          <button style="padding: 6px 12px; color: var(--rig-color-error, #ef4444)">Delete</button>
        </template>
      </Popconfirm>
    </Variant>

    <Variant title="Custom Labels">
      <Popconfirm
        v-model:open="customOpen"
        title="Discard unsaved changes?"
        confirm-label="Yes, discard"
        cancel-label="Keep editing"
        @confirm="() => {}"
        @cancel="() => {}"
      >
        <template #trigger>
          <button style="padding: 6px 12px">Close Editor</button>
        </template>
      </Popconfirm>
    </Variant>

    <Variant title="Playground">
      <Popconfirm
        v-model:open="playgroundOpen"
        :title="title"
        :confirm-label="confirmLabel"
        :cancel-label="cancelLabel"
        @confirm="lastAction = 'confirmed'"
        @cancel="lastAction = 'cancelled'"
      >
        <template #trigger>
          <button style="padding: 6px 12px">Trigger Popconfirm</button>
        </template>
      </Popconfirm>
      <div
        v-if="lastAction"
        style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
      >
        Last action: {{ lastAction }}
      </div>

      <template #controls>
        <HstText v-model="title" title="Title" />
        <HstText v-model="confirmLabel" title="Confirm Label" />
        <HstText v-model="cancelLabel" title="Cancel Label" />
      </template>
    </Variant>
  </Story>
</template>
