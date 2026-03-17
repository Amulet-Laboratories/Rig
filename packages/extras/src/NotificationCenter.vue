<script setup lang="ts">
import { ref, useId, watch, onUnmounted, nextTick } from 'vue'
import { useNotifications } from './useNotifications'

defineSlots<{
  bell?: (props: { unreadCount: number }) => unknown
  empty?: (props: Record<string, never>) => unknown
}>()
const panelId = useId()
const bellRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const { notifications, unreadCount, dismiss, markAllRead, clear } = useNotifications()

const open = ref(false)

async function toggle() {
  open.value = !open.value
  if (open.value) {
    markAllRead()
    await nextTick()
    // Focus the first focusable element in the panel
    const first = panelRef.value?.querySelector<HTMLElement>('button, [tabindex]')
    first?.focus()
  }
}

function close() {
  open.value = false
  // Return focus to the bell trigger
  bellRef.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.preventDefault()
    close()
  }
}

// Register the Escape listener only while the panel is open so multiple
// mounted instances don't stack document listeners unnecessarily.
watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

function onDismiss(id: string) {
  dismiss(id)
}

function onClear() {
  clear()
  open.value = false
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div data-rig-notification-center>
    <button
      ref="bellRef"
      data-rig-notification-bell
      :data-unread="unreadCount > 0 || undefined"
      :aria-label="`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="toggle"
    >
      <slot name="bell" :unread-count="unreadCount">
        <span data-rig-notification-bell-icon>&#x1F514;</span>
        <span v-if="unreadCount > 0" data-rig-notification-badge>{{ unreadCount }}</span>
      </slot>
    </button>

    <div
      v-if="open"
      :id="panelId"
      ref="panelRef"
      data-rig-notification-panel
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <div data-rig-notification-header>
        <span>Notifications</span>
        <button v-if="notifications.length > 0" data-rig-notification-clear @click="onClear">
          Clear all
        </button>
      </div>

      <div v-if="notifications.length === 0" data-rig-notification-empty>
        <slot name="empty">No notifications</slot>
      </div>

      <ul v-else data-rig-notification-list>
        <li
          v-for="n in [...notifications].reverse()"
          :key="n.id"
          data-rig-notification-item
          :data-variant="n.variant"
          :data-read="n.read || undefined"
          :data-persistent="n.persistent || undefined"
        >
          <span data-rig-notification-message>{{ n.message }}</span>
          <span data-rig-notification-time>{{ formatTime(n.timestamp) }}</span>
          <button data-rig-notification-dismiss aria-label="Dismiss" @click="onDismiss(n.id)">
            &times;
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
