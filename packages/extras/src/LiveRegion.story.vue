<script setup lang="ts">
import LiveRegion from './LiveRegion.vue'
import { useAnnounce } from '@core/composables/useAnnounce'
import { ref } from 'vue'

const { announce, message } = useAnnounce()

const customMessage = ref('Record saved successfully')

function announceInfo() {
  announce('Build started')
}

function announceSave() {
  announce('Changes saved')
}

function announceError() {
  announce('Error: failed to fetch data')
}

function announceCustom() {
  announce(customMessage.value)
}

function announceRapid() {
  announce('First message')
  window.setTimeout(() => announce('Second message'), 500)
  window.setTimeout(() => announce('Third message'), 1000)
}
</script>

<template>
  <Story title="LiveRegion" icon="lucide:megaphone" group="extras">
    <Variant title="Default">
      <LiveRegion />
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
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
            @click="announceInfo"
          >
            Announce Info
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
            @click="announceSave"
          >
            Announce Save
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
            @click="announceError"
          >
            Announce Error
          </button>
        </div>
        <p style="color: var(--muted-foreground); font-size: 13px">
          Current message:
          <strong style="color: var(--foreground)">{{ message || '(empty)' }}</strong>
        </p>
        <p style="color: var(--muted-foreground); font-size: 12px">
          The live region is visually hidden. Messages are announced to screen readers and shown
          above for demo purposes.
        </p>
      </div>
    </Variant>

    <Variant title="Rapid Announcements">
      <LiveRegion />
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
          @click="announceRapid"
        >
          Fire 3 Rapid Announcements
        </button>
        <p style="color: var(--muted-foreground); font-size: 13px">
          Current message:
          <strong style="color: var(--foreground)">{{ message || '(empty)' }}</strong>
        </p>
        <p style="color: var(--muted-foreground); font-size: 12px">
          Each announcement replaces the previous one. The last message clears after 5 seconds.
        </p>
      </div>
    </Variant>

    <Variant title="Playground">
      <LiveRegion />
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
          @click="announceCustom"
        >
          Announce
        </button>
        <p style="color: var(--muted-foreground); font-size: 13px">
          Current message:
          <strong style="color: var(--foreground)">{{ message || '(empty)' }}</strong>
        </p>
      </div>

      <template #controls>
        <HstText v-model="customMessage" title="Message" />
      </template>
    </Variant>
  </Story>
</template>
