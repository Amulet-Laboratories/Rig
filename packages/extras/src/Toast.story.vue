<script setup lang="ts">
import Toast from './Toast.vue'
import { ref } from 'vue'
import { useToast } from './useToast'

const { add, clear } = useToast()

const variant = ref<'info' | 'success' | 'warning' | 'error'>('info')
const message = ref('File saved successfully')
const duration = ref(5000)
const dismissible = ref(true)

function addToast(v: 'info' | 'success' | 'warning' | 'error', msg: string) {
  add({ message: msg, variant: v, duration: 8000 })
}
</script>

<template>
  <Story title="Toast" icon="lucide:bell-ring" group="extras">
    <Variant title="Default">
      <Toast />
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="addToast('info', 'Build started')"
        >
          Info
        </button>
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="addToast('success', 'Deployment complete')"
        >
          Success
        </button>
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="addToast('warning', 'API rate limit approaching')"
        >
          Warning
        </button>
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="addToast('error', 'Failed to save changes')"
        >
          Error
        </button>
        <button
          style="
            padding: 6px 12px;
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--muted-foreground);
            cursor: pointer;
          "
          @click="clear()"
        >
          Clear All
        </button>
      </div>
    </Variant>

    <Variant title="Persistent (no auto-dismiss)">
      <Toast />
      <button
        style="
          padding: 6px 12px;
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--foreground);
          cursor: pointer;
        "
        @click="add({ message: 'This stays until dismissed', variant: 'warning', duration: 0 })"
      >
        Show Persistent Toast
      </button>
    </Variant>

    <Variant title="Non-Dismissible">
      <Toast />
      <button
        style="
          padding: 6px 12px;
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--foreground);
          cursor: pointer;
        "
        @click="
          add({
            message: 'Processing... please wait',
            variant: 'info',
            dismissible: false,
            duration: 0,
          })
        "
      >
        Show Non-Dismissible
      </button>
    </Variant>

    <Variant title="Custom Slot">
      <Toast>
        <template #toast="{ message: msg, variant: v, dismiss }">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              background: var(--card);
              border: 1px solid var(--border);
              border-radius: 6px;
              color: var(--foreground);
              font-size: 13px;
            "
          >
            <span v-if="v === 'success'" style="color: #4caf50">&#10003;</span>
            <span v-else-if="v === 'error'" style="color: #f44336">&#10007;</span>
            <span v-else-if="v === 'warning'" style="color: #ff9800">&#9888;</span>
            <span v-else style="color: #2196f3">&#9432;</span>
            <span style="flex: 1">{{ msg }}</span>
            <button
              style="
                background: none;
                border: none;
                color: var(--muted-foreground);
                cursor: pointer;
                font-size: 16px;
              "
              @click="dismiss"
            >
              &times;
            </button>
          </div>
        </template>
      </Toast>
      <button
        style="
          padding: 6px 12px;
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--foreground);
          cursor: pointer;
        "
        @click="addToast('success', 'Custom styled toast')"
      >
        Show Custom Toast
      </button>
    </Variant>

    <Variant title="Playground">
      <Toast />
      <button
        style="
          padding: 6px 12px;
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--foreground);
          cursor: pointer;
        "
        @click="add({ message, variant, duration, dismissible })"
      >
        Show Toast
      </button>

      <template #controls>
        <HstText v-model="message" title="Message" />
        <HstSelect
          v-model="variant"
          title="Variant"
          :options="['info', 'success', 'warning', 'error']"
        />
        <HstSlider v-model="duration" title="Duration (ms)" :min="0" :max="15000" :step="1000" />
        <HstCheckbox v-model="dismissible" title="Dismissible" />
      </template>
    </Variant>
  </Story>
</template>
