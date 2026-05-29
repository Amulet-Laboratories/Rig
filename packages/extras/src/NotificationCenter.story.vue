<script setup lang="ts">
import NotificationCenter from './NotificationCenter.vue'
import { useNotifications } from './useNotifications'

const { push, clear } = useNotifications()

function addSample(variant: 'info' | 'success' | 'warning' | 'error', message: string) {
  push({ message, variant, duration: 0 })
}

function seedNotifications() {
  push({ message: 'Build succeeded for main branch', variant: 'success', duration: 0 })
  push({ message: 'PR #42 ready for review', variant: 'info', duration: 0 })
  push({ message: 'Disk usage at 85%', variant: 'warning', duration: 0 })
  push({ message: 'Deployment failed: staging', variant: 'error', persistent: true, duration: 0 })
}
</script>

<template>
  <Story title="NotificationCenter" icon="lucide:bell" group="extras">
    <Variant title="Default">
      <div
        style="
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
          padding: 12px;
        "
      >
        <div style="display: flex; gap: 6px; flex-wrap: wrap">
          <button
            style="
              padding: 4px 10px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
              font-size: 12px;
            "
            @click="addSample('info', 'New comment on issue #7')"
          >
            + Info
          </button>
          <button
            style="
              padding: 4px 10px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
              font-size: 12px;
            "
            @click="addSample('success', 'Tests passed')"
          >
            + Success
          </button>
          <button
            style="
              padding: 4px 10px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
              font-size: 12px;
            "
            @click="addSample('warning', 'Memory usage high')"
          >
            + Warning
          </button>
          <button
            style="
              padding: 4px 10px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
              font-size: 12px;
            "
            @click="addSample('error', 'Pipeline failed')"
          >
            + Error
          </button>
          <button
            style="
              padding: 4px 10px;
              background: transparent;
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--muted-foreground);
              cursor: pointer;
              font-size: 12px;
            "
            @click="seedNotifications()"
          >
            Seed 4
          </button>
          <button
            style="
              padding: 4px 10px;
              background: transparent;
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--muted-foreground);
              cursor: pointer;
              font-size: 12px;
            "
            @click="clear()"
          >
            Clear
          </button>
        </div>
        <NotificationCenter />
      </div>
    </Variant>

    <Variant title="Persistent Notification">
      <div
        style="
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
          padding: 12px;
        "
      >
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
            push({
              message: 'Critical: server unreachable',
              variant: 'error',
              persistent: true,
              duration: 0,
            })
          "
        >
          Add Persistent Alert
        </button>
        <NotificationCenter />
      </div>
    </Variant>

    <Variant title="Custom Bell Slot">
      <div
        style="
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
          padding: 12px;
        "
      >
        <button
          style="
            padding: 4px 10px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
            font-size: 12px;
          "
          @click="addSample('info', 'New notification')"
        >
          + Add
        </button>
        <NotificationCenter>
          <template #bell="{ unreadCount }">
            <button
              style="
                padding: 6px 12px;
                background: var(--muted);
                border: 1px solid var(--border);
                border-radius: 4px;
                color: var(--foreground);
                cursor: pointer;
                position: relative;
              "
            >
              Inbox
              <span
                v-if="unreadCount > 0"
                style="margin-left: 4px; color: var(--primary); font-weight: 600"
              >
                ({{ unreadCount }})
              </span>
            </button>
          </template>
        </NotificationCenter>
      </div>
    </Variant>

    <Variant title="Custom Empty Slot">
      <div style="display: flex; justify-content: flex-end; padding: 12px">
        <NotificationCenter>
          <template #empty>
            <div
              style="
                text-align: center;
                padding: 24px;
                color: var(--muted-foreground);
                font-size: 13px;
              "
            >
              <div style="font-size: 24px; margin-bottom: 8px">&#x2728;</div>
              All caught up — no new notifications
            </div>
          </template>
        </NotificationCenter>
      </div>
    </Variant>
  </Story>
</template>
