<script setup lang="ts">
import ConfirmDialog from './ConfirmDialog.vue'
import { requestConfirm } from '@core/composables/useConfirm'
import { ref } from 'vue'

const result = ref<string>('No action yet')

async function showBasic() {
  const ok = await requestConfirm('Are you sure you want to proceed?')
  result.value = ok ? 'Confirmed' : 'Cancelled'
}

async function showDestructive() {
  const ok = await requestConfirm({
    title: 'Delete Item',
    message: 'This action cannot be undone. All associated data will be permanently removed.',
    confirmLabel: 'Delete',
    destructive: true,
  })
  result.value = ok ? 'Deleted' : 'Cancelled'
}

async function showCustomTitle() {
  const ok = await requestConfirm({
    title: 'Publish Changes',
    message: 'This will deploy your changes to production immediately.',
    confirmLabel: 'Publish',
  })
  result.value = ok ? 'Published' : 'Cancelled'
}

const playgroundTitle = ref('Confirm')
const playgroundMessage = ref('Are you sure?')
const playgroundConfirmLabel = ref('Confirm')
const playgroundDestructive = ref(false)

async function showPlayground() {
  const ok = await requestConfirm({
    title: playgroundTitle.value,
    message: playgroundMessage.value,
    confirmLabel: playgroundConfirmLabel.value,
    destructive: playgroundDestructive.value,
  })
  result.value = ok ? 'Confirmed' : 'Cancelled'
}
</script>

<template>
  <Story title="ConfirmDialog" icon="lucide:shield-question" group="extras">
    <Variant title="Default">
      <ConfirmDialog />
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="showBasic"
        >
          Request Confirmation
        </button>
        <p style="color: var(--muted-foreground); font-size: 13px">
          Result: <strong style="color: var(--foreground)">{{ result }}</strong>
        </p>
      </div>
    </Variant>

    <Variant title="Destructive">
      <ConfirmDialog />
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="showDestructive"
        >
          Delete Item
        </button>
        <p style="color: var(--muted-foreground); font-size: 13px">
          Result: <strong style="color: var(--foreground)">{{ result }}</strong>
        </p>
      </div>
    </Variant>

    <Variant title="Custom Title and Label">
      <ConfirmDialog />
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="showCustomTitle"
        >
          Publish Changes
        </button>
        <p style="color: var(--muted-foreground); font-size: 13px">
          Result: <strong style="color: var(--foreground)">{{ result }}</strong>
        </p>
      </div>
    </Variant>

    <Variant title="Playground">
      <ConfirmDialog />
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="showPlayground"
        >
          Show Dialog
        </button>
        <p style="color: var(--muted-foreground); font-size: 13px">
          Result: <strong style="color: var(--foreground)">{{ result }}</strong>
        </p>
      </div>

      <template #controls>
        <HstText v-model="playgroundTitle" title="Title" />
        <HstText v-model="playgroundMessage" title="Message" />
        <HstText v-model="playgroundConfirmLabel" title="Confirm Label" />
        <HstCheckbox v-model="playgroundDestructive" title="Destructive" />
      </template>
    </Variant>
  </Story>
</template>
