<script setup lang="ts">
import ChatPanel, { type ChatMessage } from './ChatPanel.vue'
import { ref } from 'vue'

const defaultMessages: ChatMessage[] = [
  { id: 1, role: 'user', content: 'What files are in this project?' },
  { id: 2, role: 'assistant', content: 'I found 12 files across 3 directories.' },
  { id: 3, role: 'user', content: 'Show me the main entry point.' },
]

const emptyMessages: ChatMessage[] = []

const pendingMessages: ChatMessage[] = [
  { id: 1, role: 'user', content: 'Summarize the architecture.' },
]

const pgTitle = ref('Chat')
const pgPlaceholder = ref('Type a message...')
const pgPending = ref(false)
const pgMessages = ref<ChatMessage[]>([
  { id: 1, role: 'user', content: 'Hello there.' },
  { id: 2, role: 'assistant', content: 'How can I help you today?' },
])
</script>

<template>
  <Story title="ChatPanel" icon="lucide:message-circle" group="shell">
    <Variant title="Default">
      <div style="height: 400px; width: 320px; border: 1px solid var(--border)">
        <ChatPanel :messages="defaultMessages" title="Assistant" />
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="height: 400px; width: 320px; border: 1px solid var(--border)">
        <ChatPanel :messages="emptyMessages" title="Chat" />
      </div>
    </Variant>

    <Variant title="Pending">
      <div style="height: 400px; width: 320px; border: 1px solid var(--border)">
        <ChatPanel :messages="pendingMessages" title="Assistant" pending />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 400px; width: 320px; border: 1px solid var(--border)">
        <ChatPanel
          :messages="pgMessages"
          :title="pgTitle"
          :placeholder="pgPlaceholder"
          :pending="pgPending"
        />
      </div>

      <template #controls>
        <HstText v-model="pgTitle" title="Title" />
        <HstText v-model="pgPlaceholder" title="Placeholder" />
        <HstCheckbox v-model="pgPending" title="Pending" />
      </template>
    </Variant>
  </Story>
</template>
