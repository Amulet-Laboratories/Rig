<!--
  ChatPanel — Generic chat/assistant panel for IdeShell aux slot.
  Provides message list + input + send affordance.
  Consumers supply message data and handle submission.
-->
<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Input, Button } from '@core/primitives'

export interface ChatMessage {
  id: string | number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
  toolCalls?: { name: string; args?: unknown }[]
}

const props = withDefaults(
  defineProps<{
    /** Array of chat messages to display */
    messages?: ChatMessage[]
    /** Whether a response is pending */
    pending?: boolean
    /** Placeholder text for the input */
    placeholder?: string
    /** Title shown in the header */
    title?: string
    /** Input element ID for focus targeting */
    inputId?: string
  }>(),
  {
    messages: () => [],
    pending: false,
    placeholder: 'Type a message...',
    title: 'Chat',
    inputId: 'chat-input',
  },
)

const emit = defineEmits<{
  send: [text: string]
  clear: []
}>()

defineSlots<{
  /** Header content — overrides default title + clear button */
  header?: (props: Record<string, never>) => unknown
  /** Custom message rendering */
  message?: (props: { message: ChatMessage; index: number }) => unknown
  /** Empty state when no messages */
  empty?: (props: Record<string, never>) => unknown
  /** Pending indicator */
  pending?: (props: Record<string, never>) => unknown
  /** Input area — overrides default input + send button */
  input?: (props: { send: (text: string) => void; pending: boolean }) => unknown
}>()

const inputText = ref('')
const messagesRef = ref<HTMLElement | null>(null)

// Auto-scroll on new messages
watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  },
)

function send(text?: string) {
  const value = (text ?? inputText.value).trim()
  if (!value || props.pending) return
  inputText.value = ''
  emit('send', value)
}
</script>

<template>
  <div data-rig-chat-panel>
    <!-- Header -->
    <div data-rig-chat-panel-header>
      <slot name="header">
        <span data-rig-chat-panel-title>{{ title }}</span>
        <Button v-if="messages.length > 0" variant="ghost" size="sm" @click="emit('clear')">
          clear
        </Button>
      </slot>
    </div>

    <!-- Messages -->
    <div ref="messagesRef" data-rig-chat-panel-messages role="log" aria-label="Chat messages">
      <slot v-if="messages.length === 0" name="empty">
        <div data-rig-chat-panel-empty>No messages yet.</div>
      </slot>
      <template v-else>
        <div
          v-for="(msg, i) in messages"
          :key="msg.id ?? i"
          data-rig-chat-panel-message
          :data-role="msg.role"
        >
          <slot name="message" :message="msg" :index="i">
            <div data-rig-chat-panel-message-meta>
              <span :data-role="msg.role">{{ msg.role === 'user' ? 'you' : 'ai' }}</span>
            </div>
            <div data-rig-chat-panel-message-content>{{ msg.content }}</div>
          </slot>
        </div>
      </template>
      <div v-if="pending" data-rig-chat-panel-pending aria-live="polite" aria-atomic="true">
        <slot name="pending">thinking...</slot>
      </div>
    </div>

    <!-- Input -->
    <div data-rig-chat-panel-input>
      <slot name="input" :send="send" :pending="pending">
        <div data-rig-chat-panel-input-row>
          <Input
            :id="inputId"
            v-model="inputText"
            :placeholder="placeholder"
            :disabled="pending"
            @keydown.enter="send()"
          />
          <Button
            variant="ghost"
            size="sm"
            :disabled="pending || !inputText.trim()"
            @click="send()"
          >
            Send
          </Button>
        </div>
      </slot>
    </div>
  </div>
</template>
