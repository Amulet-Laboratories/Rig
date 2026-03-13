<script setup lang="ts">
/**
 * ChatPanel — AI assistant chat sidebar.
 * Reusable across IDE and multi-panel showcases.
 */
import { ref } from 'vue'
import Icon from '@core/primitives/Icon.vue'

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  text: string
}

export interface ChatContext {
  id: string
  label: string
  icon: string
}

const props = defineProps<{
  modes: readonly string[]
  models: readonly string[]
  contexts: readonly ChatContext[]
}>()

const emit = defineEmits<{
  close: []
}>()

// State
const mode = defineModel<string>('mode', { required: true })
const model = defineModel<string>('model', { required: true })
const context = defineModel<string>('context', { required: true })

const input = ref('')
const modeOpen = ref(false)
const modelOpen = ref(false)
const contextOpen = ref(false)

let msgId = 0
const messages = ref<ChatMessage[]>([
  { id: msgId++, role: 'assistant', text: "Hi! I'm your AI assistant. How can I help you today?" },
])

function send() {
  const text = input.value.trim()
  if (!text) return
  messages.value.push({ id: msgId++, role: 'user', text })
  input.value = ''
  const m = model.value
  const md = mode.value
  setTimeout(() => {
    messages.value.push({
      id: msgId++,
      role: 'assistant',
      text: `[${m} · ${md}] I can help with that. Let me look into "${text}" for you.`,
    })
  }, 600)
}

function newChat() {
  messages.value = [{ id: msgId++, role: 'assistant', text: 'How can I help you?' }]
}
</script>

<template>
  <div class="showcase-chat-panel">
    <div class="showcase-chat-header">
      <Icon icon="codicon:comment-discussion" size="sm" />
      <span class="showcase-chat-title">Copilot Chat</span>
      <div class="showcase-chat-header-actions">
        <button class="showcase-chat-header-btn" aria-label="New Chat" @click="newChat">
          <Icon icon="codicon:add" size="sm" />
        </button>
        <button class="showcase-chat-header-btn" aria-label="Close Chat" @click="emit('close')">
          <Icon icon="codicon:close" size="sm" />
        </button>
      </div>
    </div>

    <div class="showcase-chat-messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="showcase-chat-msg"
        :class="msg.role === 'user' ? 'showcase-chat-msg-user' : 'showcase-chat-msg-assistant'"
      >
        <div class="showcase-chat-msg-avatar">
          <Icon :icon="msg.role === 'user' ? 'codicon:account' : 'codicon:sparkle'" size="sm" />
        </div>
        <div class="showcase-chat-msg-content">
          <div class="showcase-chat-msg-author">{{ msg.role === 'user' ? 'You' : 'Copilot' }}</div>
          <div class="showcase-chat-msg-text">{{ msg.text }}</div>
        </div>
      </div>
    </div>

    <div class="showcase-chat-input-area">
      <!-- Selectors -->
      <div class="showcase-chat-selectors">
        <!-- Mode -->
        <div
          class="showcase-chat-selector"
          @click="modeOpen = !modeOpen"
          @mouseleave="modeOpen = false"
        >
          <span class="showcase-chat-selector-label">{{ mode }}</span>
          <Icon icon="codicon:chevron-down" size="xs" />
          <div v-if="modeOpen" class="showcase-chat-selector-dropdown">
            <button
              v-for="m in props.modes"
              :key="m"
              class="showcase-chat-selector-option"
              :class="{ active: mode === m }"
              @click.stop="mode = m; modeOpen = false"
            >
              {{ m }}
            </button>
          </div>
        </div>

        <!-- Model -->
        <div
          class="showcase-chat-selector"
          @click="modelOpen = !modelOpen"
          @mouseleave="modelOpen = false"
        >
          <Icon icon="codicon:sparkle" size="xs" />
          <span class="showcase-chat-selector-label">{{ model }}</span>
          <Icon icon="codicon:chevron-down" size="xs" />
          <div v-if="modelOpen" class="showcase-chat-selector-dropdown showcase-chat-selector-dropdown-wide">
            <button
              v-for="mdl in props.models"
              :key="mdl"
              class="showcase-chat-selector-option"
              :class="{ active: model === mdl }"
              @click.stop="model = mdl; modelOpen = false"
            >
              <Icon icon="codicon:sparkle" size="xs" />
              {{ mdl }}
            </button>
          </div>
        </div>

        <div class="showcase-chat-selectors-spacer" />

        <!-- Context -->
        <div
          class="showcase-chat-selector"
          @click="contextOpen = !contextOpen"
          @mouseleave="contextOpen = false"
        >
          <Icon icon="codicon:attach" size="xs" />
          <div v-if="contextOpen" class="showcase-chat-selector-dropdown showcase-chat-selector-dropdown-wide">
            <button
              v-for="ctx in props.contexts"
              :key="ctx.id"
              class="showcase-chat-selector-option"
              :class="{ active: context === ctx.id }"
              @click.stop="context = ctx.id; contextOpen = false"
            >
              <Icon :icon="ctx.icon" size="xs" />
              {{ ctx.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="showcase-chat-input-wrapper">
        <input
          v-model="input"
          class="showcase-chat-input"
          type="text"
          :placeholder="`${mode} Copilot (${model})...`"
          @keydown.enter="send"
        />
        <button
          class="showcase-chat-send-btn"
          :disabled="!input.trim()"
          aria-label="Send"
          @click="send"
        >
          <Icon icon="codicon:send" size="sm" />
        </button>
      </div>
    </div>
  </div>
</template>
