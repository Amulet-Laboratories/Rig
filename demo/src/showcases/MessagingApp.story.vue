<script setup lang="ts">
/**
 * Messaging App — Real-time chat interface
 * Theme: Obsidian | Exercises: core, lists, nav, layout, extras
 *
 * Showcase #8 — Conversation list, message thread, user presence,
 * reactions, attachments, and channel sidebar.
 */
import { ref, computed, nextTick } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Icon from '@core/primitives/Icon.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Input from '@core/primitives/Input.vue'
import Avatar from '@core/primitives/Avatar.vue'
import Textarea from '@core/primitives/Textarea.vue'
import StatusBar from '@nav/StatusBar.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  conversations,
  channels,
  currentUser,
  formatMessageTime,
  formatConversationTime,
  getOtherParticipant,
  getLastMessage,
  getSenderName,
  getUserById,
  type Message,
} from './fixtures/messaging-data'

// ---------------------------------------------------------------------------
// Active conversation
// ---------------------------------------------------------------------------
const activeConvId = ref(conversations[0]!.id)

const activeConv = computed(
  () => conversations.find((c) => c.id === activeConvId.value) ?? null,
)

function selectConversation(convId: string) {
  activeConvId.value = convId
}

// ---------------------------------------------------------------------------
// Message input
// ---------------------------------------------------------------------------
const messageInput = ref('')

function sendMessage() {
  if (!messageInput.value.trim() || !activeConv.value) return

  const msg: Message = {
    id: `msg-new-${Date.now()}`,
    senderId: currentUser.id,
    text: messageInput.value.trim(),
    timestamp: new Date().toISOString(),
    read: true,
    reactions: [],
    replyTo: null,
    attachments: [],
  }

  activeConv.value.messages.push(msg)
  messageInput.value = ''
  toast.add({ message: 'Message sent', variant: 'success' })

  // Scroll to bottom
  nextTick(() => {
    const container = document.querySelector('.msg-thread')
    if (container) container.scrollTop = container.scrollHeight
  })
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
const searchQuery = ref('')

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations
  const q = searchQuery.value.toLowerCase()
  return conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.messages.some((m) => m.text.toLowerCase().includes(q)),
  )
})

// ---------------------------------------------------------------------------
// Message grouping (by sender, within 5 minutes)
// ---------------------------------------------------------------------------
interface MessageGroup {
  senderId: string
  senderName: string
  messages: Message[]
  timestamp: string
  isCurrentUser: boolean
}

const messageGroups = computed((): MessageGroup[] => {
  if (!activeConv.value) return []
  const groups: MessageGroup[] = []

  for (const msg of activeConv.value.messages) {
    const last = groups[groups.length - 1]
    const timeDiff = last
      ? (new Date(msg.timestamp).getTime() - new Date(last.timestamp).getTime()) / 60000
      : Infinity

    if (last && last.senderId === msg.senderId && timeDiff < 5) {
      last.messages.push(msg)
    } else {
      groups.push({
        senderId: msg.senderId,
        senderName: getSenderName(msg.senderId),
        messages: [msg],
        timestamp: msg.timestamp,
        isCurrentUser: msg.senderId === currentUser.id,
      })
    }
  }

  return groups
})

// ---------------------------------------------------------------------------
// Sidebar section
// ---------------------------------------------------------------------------
const sidebarSection = ref<'conversations' | 'channels'>('conversations')

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const totalUnread = computed(() =>
  conversations.reduce((sum, c) => sum + c.unreadCount, 0),
)

const statusBarItems = computed(() => [
  { id: 'user', content: currentUser.name, priority: 1, align: 'left' as const },
  { id: 'status', content: 'Online', priority: 2, align: 'left' as const },
  { id: 'unread', content: `${totalUnread.value} unread`, priority: 3, align: 'right' as const },
  { id: 'convos', content: `${conversations.length} conversations`, priority: 4, align: 'right' as const },
])
</script>

<template>
  <Story title="Messaging App" icon="codicon:comment-discussion" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="msg-shell" data-theme="obsidian">
        <!-- Sidebar -->
        <aside class="msg-sidebar">
          <!-- User header -->
          <div class="msg-sidebar-header">
            <div class="msg-user-info">
              <Avatar :name="currentUser.name" :color="currentUser.color" size="sm" status="online" />
              <span class="msg-user-name">{{ currentUser.name }}</span>
            </div>
            <IconButton ariaLabel="Settings">
              <Icon icon="codicon:gear" size="sm" />
            </IconButton>
          </div>

          <!-- Search -->
          <div class="msg-sidebar-search">
            <Input
              v-model="searchQuery"
              placeholder="Search messages..."
              clearable
              :debounce="200"
            >
              <template #leading>
                <Icon icon="codicon:search" size="sm" />
              </template>
            </Input>
          </div>

          <!-- Section toggle -->
          <div class="msg-section-toggle">
            <button
              class="msg-section-btn"
              :data-active="sidebarSection === 'conversations' || undefined"
              @click="sidebarSection = 'conversations'"
            >
              Conversations
            </button>
            <button
              class="msg-section-btn"
              :data-active="sidebarSection === 'channels' || undefined"
              @click="sidebarSection = 'channels'"
            >
              Channels
            </button>
          </div>

          <!-- Conversation list -->
          <div v-if="sidebarSection === 'conversations'" class="msg-conv-list">
            <button
              v-for="conv in filteredConversations"
              :key="conv.id"
              class="msg-conv-item"
              :data-active="conv.id === activeConvId || undefined"
              :data-pinned="conv.pinned || undefined"
              @click="selectConversation(conv.id)"
            >
              <div class="msg-conv-avatar">
                <Avatar
                  v-if="conv.isGroup"
                  :name="conv.name"
                  size="md"
                />
                <Avatar
                  v-else
                  :name="getOtherParticipant(conv)?.name ?? conv.name"
                  :color="getOtherParticipant(conv)?.color"
                  :status="getOtherParticipant(conv)?.status ?? undefined"
                  size="md"
                />
              </div>
              <div class="msg-conv-info">
                <div class="msg-conv-top">
                  <span class="msg-conv-name">
                    <Icon v-if="conv.isGroup" icon="codicon:organization" size="xs" />
                    {{ conv.name }}
                  </span>
                  <span class="msg-conv-time">
                    {{ formatConversationTime(conv.lastActivity) }}
                  </span>
                </div>
                <div class="msg-conv-preview">
                  <span v-if="getLastMessage(conv)" class="msg-conv-text">
                    <strong v-if="conv.isGroup">{{ getSenderName(getLastMessage(conv)!.senderId).split(' ')[0] }}:</strong>
                    {{ getLastMessage(conv)!.text }}
                  </span>
                  <Badge v-if="conv.unreadCount > 0" variant="primary" size="xs">
                    {{ conv.unreadCount }}
                  </Badge>
                </div>
              </div>
              <div class="msg-conv-indicators">
                <Icon v-if="conv.pinned" icon="codicon:pin" size="xs" class="msg-pin-icon" />
                <Icon v-if="conv.muted" icon="codicon:bell-slash" size="xs" class="msg-mute-icon" />
              </div>
            </button>
          </div>

          <!-- Channel list -->
          <div v-else class="msg-channel-list">
            <button
              v-for="ch in channels"
              :key="ch.id"
              class="msg-channel-item"
            >
              <Icon :icon="ch.icon" size="sm" />
              <span class="msg-channel-name"># {{ ch.name }}</span>
              <Badge v-if="ch.unreadCount > 0" variant="primary" size="xs">
                {{ ch.unreadCount }}
              </Badge>
            </button>
          </div>
        </aside>

        <!-- Main chat area -->
        <main class="msg-main">
          <template v-if="activeConv">
            <!-- Chat header -->
            <header class="msg-chat-header">
              <div class="msg-chat-header-left">
                <Avatar
                  v-if="!activeConv.isGroup"
                  :name="getOtherParticipant(activeConv)?.name ?? activeConv.name"
                  :color="getOtherParticipant(activeConv)?.color"
                  :status="getOtherParticipant(activeConv)?.status ?? undefined"
                  size="sm"
                />
                <div>
                  <h2 class="msg-chat-title">
                    <Icon v-if="activeConv.isGroup" icon="codicon:organization" size="sm" />
                    {{ activeConv.name }}
                  </h2>
                  <span class="msg-chat-subtitle">
                    {{ activeConv.isGroup
                      ? `${activeConv.participants.length} members`
                      : getOtherParticipant(activeConv)?.role ?? ''
                    }}
                  </span>
                </div>
              </div>
              <div class="msg-chat-header-right">
                <IconButton ariaLabel="Search in conversation">
                  <Icon icon="codicon:search" size="sm" />
                </IconButton>
                <IconButton ariaLabel="Conversation info">
                  <Icon icon="codicon:info" size="sm" />
                </IconButton>
              </div>
            </header>

            <!-- Message thread -->
            <div class="msg-thread" tabindex="0" role="region" aria-label="Message thread">
              <div
                v-for="group in messageGroups"
                :key="group.messages[0]!.id"
                class="msg-group"
                :data-self="group.isCurrentUser || undefined"
              >
                <Avatar
                  v-if="!group.isCurrentUser"
                  :name="group.senderName"
                  :color="getUserById(group.senderId)?.color"
                  size="sm"
                />
                <div class="msg-group-content">
                  <div class="msg-group-header">
                    <span class="msg-sender">{{ group.senderName }}</span>
                    <span class="msg-time">{{ formatMessageTime(group.timestamp) }}</span>
                  </div>
                  <div
                    v-for="msg in group.messages"
                    :key="msg.id"
                    class="msg-bubble"
                    :data-self="group.isCurrentUser || undefined"
                  >
                    <span class="msg-text">{{ msg.text }}</span>

                    <!-- Attachments -->
                    <div v-if="msg.attachments.length" class="msg-attachments">
                      <div
                        v-for="att in msg.attachments"
                        :key="att.id"
                        class="msg-attachment"
                      >
                        <Icon
                          :icon="att.type === 'image' ? 'codicon:file-media' : 'codicon:file'"
                          size="sm"
                        />
                        <span class="msg-att-name">{{ att.name }}</span>
                        <span class="msg-att-size">{{ att.size }}</span>
                      </div>
                    </div>

                    <!-- Reactions -->
                    <div v-if="msg.reactions.length" class="msg-reactions">
                      <span
                        v-for="(reaction, rIdx) in msg.reactions"
                        :key="rIdx"
                        class="msg-reaction"
                      >
                        {{ reaction.emoji }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input area -->
            <div class="msg-input-area">
              <IconButton ariaLabel="Attach file">
                <Icon icon="codicon:attach" size="sm" />
              </IconButton>
              <Textarea
                v-model="messageInput"
                placeholder="Type a message..."
                :rows="2"
                resize="none"
                @keydown.enter.exact.prevent="sendMessage"
              />
              <Button
                variant="primary"
                size="sm"
                :disabled="!messageInput.trim()"
                @click="sendMessage"
              >
                <Icon icon="codicon:send" size="sm" />
                Send
              </Button>
            </div>
          </template>

          <!-- No conversation selected -->
          <div v-else class="msg-empty">
            <EmptyState
              title="No conversation selected"
              description="Choose a conversation from the sidebar to start chatting."
              icon="codicon:comment-discussion"
            />
          </div>
        </main>

        <!-- Status bar -->
        <StatusBar :items="statusBarItems" />

        <!-- Toast -->
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY STATE ================== -->
    <Variant title="Empty State">
      <div class="msg-shell" data-theme="obsidian">
        <aside class="msg-sidebar">
          <div class="msg-sidebar-header">
            <div class="msg-user-info">
              <Avatar :name="currentUser.name" :color="currentUser.color" size="sm" status="online" />
              <span class="msg-user-name">{{ currentUser.name }}</span>
            </div>
          </div>
          <div class="msg-conv-list msg-centered">
            <EmptyState
              title="No conversations"
              description="Start a new conversation to begin messaging."
              icon="codicon:comment"
            >
              <template #action>
                <Button variant="primary" size="sm">
                  <Icon icon="codicon:add" size="sm" />
                  New Chat
                </Button>
              </template>
            </EmptyState>
          </div>
        </aside>
        <main class="msg-main">
          <div class="msg-empty">
            <EmptyState
              title="Welcome to Anchor Chat"
              description="Select or start a conversation to begin messaging with your team."
              icon="codicon:comment-discussion"
            />
          </div>
        </main>
        <StatusBar :items="[]" />
      </div>
    </Variant>

    <!-- ================== VARIANT: CHANNEL VIEW ================== -->
    <Variant title="Channel List">
      <div class="msg-shell" data-theme="obsidian">
        <aside class="msg-sidebar">
          <div class="msg-sidebar-header">
            <div class="msg-user-info">
              <Avatar :name="currentUser.name" :color="currentUser.color" size="sm" status="online" />
              <span class="msg-user-name">{{ currentUser.name }}</span>
            </div>
          </div>
          <h3 class="msg-section-header">
            <Icon icon="codicon:symbol-namespace" size="sm" />
            Channels
          </h3>
          <div class="msg-channel-list">
            <button
              v-for="ch in channels"
              :key="ch.id"
              class="msg-channel-item"
            >
              <Icon :icon="ch.icon" size="sm" />
              <span class="msg-channel-name"># {{ ch.name }}</span>
              <Badge v-if="ch.unreadCount > 0" variant="primary" size="xs">
                {{ ch.unreadCount }}
              </Badge>
            </button>
          </div>
          <h3 class="msg-section-header">
            <Icon icon="codicon:person" size="sm" />
            Direct Messages
          </h3>
          <div class="msg-conv-list">
            <button
              v-for="conv in conversations.filter(c => !c.isGroup)"
              :key="conv.id"
              class="msg-conv-item"
              @click="selectConversation(conv.id)"
            >
              <Avatar
                :name="getOtherParticipant(conv)?.name ?? conv.name"
                :color="getOtherParticipant(conv)?.color"
                :status="getOtherParticipant(conv)?.status ?? undefined"
                size="sm"
              />
              <div class="msg-conv-info">
                <span class="msg-conv-name">{{ conv.name }}</span>
              </div>
            </button>
          </div>
        </aside>
        <main class="msg-main">
          <div class="msg-empty">
            <EmptyState
              title="Select a channel"
              description="Browse channels and direct messages in the sidebar."
              icon="codicon:symbol-namespace"
            />
          </div>
        </main>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: MESSAGE DETAIL ================== -->
    <Variant title="Message Thread">
      <div class="msg-shell" data-theme="obsidian">
        <aside class="msg-sidebar">
          <div class="msg-sidebar-header">
            <div class="msg-user-info">
              <Avatar :name="currentUser.name" :color="currentUser.color" size="sm" status="online" />
              <span class="msg-user-name">{{ currentUser.name }}</span>
            </div>
          </div>
          <div class="msg-conv-list">
            <button
              v-for="conv in conversations"
              :key="conv.id"
              class="msg-conv-item"
              :data-active="conv.id === activeConvId || undefined"
              @click="selectConversation(conv.id)"
            >
              <Avatar
                :name="conv.isGroup ? conv.name : (getOtherParticipant(conv)?.name ?? conv.name)"
                :color="conv.isGroup ? undefined : getOtherParticipant(conv)?.color"
                size="sm"
              />
              <div class="msg-conv-info">
                <span class="msg-conv-name">{{ conv.name }}</span>
              </div>
              <Badge v-if="conv.unreadCount > 0" variant="primary" size="xs">
                {{ conv.unreadCount }}
              </Badge>
            </button>
          </div>
        </aside>
        <main class="msg-main">
          <template v-if="activeConv">
            <header class="msg-chat-header">
              <div class="msg-chat-header-left">
                <h2 class="msg-chat-title">{{ activeConv.name }}</h2>
              </div>
            </header>
            <div class="msg-thread">
              <div
                v-for="group in messageGroups"
                :key="group.messages[0]!.id"
                class="msg-group"
                :data-self="group.isCurrentUser || undefined"
              >
                <Avatar
                  v-if="!group.isCurrentUser"
                  :name="group.senderName"
                  :color="getUserById(group.senderId)?.color"
                  size="sm"
                />
                <div class="msg-group-content">
                  <div class="msg-group-header">
                    <span class="msg-sender">{{ group.senderName }}</span>
                    <span class="msg-time">{{ formatMessageTime(group.timestamp) }}</span>
                  </div>
                  <div
                    v-for="msg in group.messages"
                    :key="msg.id"
                    class="msg-bubble"
                    :data-self="group.isCurrentUser || undefined"
                  >
                    <span class="msg-text">{{ msg.text }}</span>
                    <div v-if="msg.attachments.length" class="msg-attachments">
                      <div
                        v-for="att in msg.attachments"
                        :key="att.id"
                        class="msg-attachment"
                      >
                        <Icon :icon="att.type === 'image' ? 'codicon:file-media' : 'codicon:file'" size="sm" />
                        <span class="msg-att-name">{{ att.name }}</span>
                        <span class="msg-att-size">{{ att.size }}</span>
                      </div>
                    </div>
                    <div v-if="msg.reactions.length" class="msg-reactions">
                      <span v-for="(reaction, rIdx) in msg.reactions" :key="rIdx" class="msg-reaction">
                        {{ reaction.emoji }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="msg-input-area">
              <Textarea
                v-model="messageInput"
                placeholder="Type a message..."
                :rows="2"
                resize="none"
                @keydown.enter.exact.prevent="sendMessage"
              />
              <Button variant="primary" size="sm" :disabled="!messageInput.trim()" @click="sendMessage">
                <Icon icon="codicon:send" size="sm" />
              </Button>
            </div>
          </template>
        </main>
        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: PARTICIPANTS ================== -->
    <Variant title="Participants Panel">
      <div class="msg-shell" data-theme="obsidian">
        <aside class="msg-sidebar">
          <div class="msg-sidebar-header">
            <div class="msg-user-info">
              <Avatar :name="currentUser.name" :color="currentUser.color" size="sm" status="online" />
              <span class="msg-user-name">{{ currentUser.name }}</span>
            </div>
          </div>
          <div class="msg-conv-list">
            <button
              v-for="conv in conversations"
              :key="conv.id"
              class="msg-conv-item"
              :data-active="conv.id === 'conv-engineering' || undefined"
              @click="selectConversation(conv.id)"
            >
              <Avatar :name="conv.name" size="sm" />
              <div class="msg-conv-info">
                <span class="msg-conv-name">{{ conv.name }}</span>
              </div>
            </button>
          </div>
        </aside>
        <main class="msg-main">
          <header class="msg-chat-header">
            <div class="msg-chat-header-left">
              <h2 class="msg-chat-title">
                <Icon icon="codicon:organization" size="sm" />
                engineering
              </h2>
              <span class="msg-chat-subtitle">7 members</span>
            </div>
          </header>
          <div class="msg-participants-panel">
            <h3 class="msg-panel-title">Members</h3>
            <div class="msg-participant-list">
              <div
                v-for="user in conversations[0]!.participants"
                :key="user.id"
                class="msg-participant"
              >
                <Avatar :name="user.name" :color="user.color" :status="user.status" size="md" />
                <div class="msg-participant-info">
                  <span class="msg-participant-name">
                    {{ user.name }}
                    <Badge v-if="user.id === currentUser.id" variant="muted" size="xs">you</Badge>
                  </span>
                  <span class="msg-participant-role">{{ user.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.msg-shell {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr auto;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #000);
  color: var(--color-foreground, #fff);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

/* ---- Sidebar ---- */
.msg-sidebar {
  grid-row: 1;
  grid-column: 1;
  border-right: 1px solid var(--color-border, #333);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: color-mix(in srgb, var(--color-background, #000) 95%, var(--color-foreground, #fff));
}

.msg-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border, #333);
}

.msg-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.msg-user-name {
  font-weight: 600;
  font-size: 14px;
}

.msg-sidebar-search {
  padding: 8px 12px;
}

/* ---- Section toggle ---- */
.msg-section-toggle {
  display: flex;
  border-bottom: 1px solid var(--color-border, #333);
}

.msg-section-btn {
  flex: 1;
  padding: 8px;
  border: none;
  background: none;
  color: var(--color-muted-foreground, #888);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-family: inherit;
  transition: color 0.1s, border-color 0.1s;
}

.msg-section-btn[data-active] {
  color: var(--color-foreground, #fff);
  border-bottom-color: var(--color-primary, #0078d4);
}

.msg-section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #888);
  margin: 0;
}

/* ---- Conversation list ---- */
.msg-conv-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

.msg-conv-list.msg-centered {
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.msg-conv-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: inherit;
  transition: background 0.1s;
  position: relative;
}

.msg-conv-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 5%, transparent);
}

.msg-conv-item[data-active] {
  background: color-mix(in srgb, var(--color-primary, #0078d4) 15%, transparent);
}

.msg-conv-avatar {
  flex-shrink: 0;
}

.msg-conv-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.msg-conv-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.msg-conv-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-conv-time {
  font-size: 10px;
  color: var(--color-muted-foreground, #888);
  flex-shrink: 0;
}

.msg-conv-preview {
  display: flex;
  align-items: center;
  gap: 6px;
}

.msg-conv-text {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.msg-conv-indicators {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.msg-pin-icon {
  color: var(--color-primary, #0078d4);
}

.msg-mute-icon {
  color: var(--color-muted-foreground, #888);
}

/* ---- Channel list ---- */
.msg-channel-list {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.msg-channel-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted-foreground, #888);
  font-family: inherit;
  font-size: 13px;
  transition: background 0.1s, color 0.1s;
}

.msg-channel-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 5%, transparent);
  color: var(--color-foreground, #fff);
}

.msg-channel-name {
  flex: 1;
}

/* ---- Main area ---- */
.msg-main {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.msg-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- Chat header ---- */
.msg-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid var(--color-border, #333);
  background: color-mix(in srgb, var(--color-background, #000) 90%, var(--color-foreground, #fff));
}

.msg-chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.msg-chat-header-right {
  display: flex;
  gap: 4px;
}

.msg-chat-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.msg-chat-subtitle {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Message thread ---- */
.msg-thread {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.msg-group {
  display: flex;
  gap: 10px;
  max-width: 75%;
}

.msg-group[data-self] {
  margin-left: auto;
  flex-direction: row-reverse;
}

.msg-group-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.msg-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.msg-group[data-self] .msg-group-header {
  flex-direction: row-reverse;
}

.msg-sender {
  font-size: 12px;
  font-weight: 600;
}

.msg-time {
  font-size: 10px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Message bubble ---- */
.msg-bubble {
  padding: 8px 12px;
  border-radius: 12px 12px 12px 4px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 8%, transparent);
  max-width: 100%;
}

.msg-bubble[data-self] {
  background: color-mix(in srgb, var(--color-primary, #0078d4) 25%, transparent);
  border-radius: 12px 12px 4px 12px;
}

.msg-text {
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;
}

/* ---- Attachments ---- */
.msg-attachments {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}

.msg-attachment {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 5%, transparent);
  font-size: 12px;
}

.msg-att-name {
  color: var(--color-primary, #0078d4);
}

.msg-att-size {
  color: var(--color-muted-foreground, #888);
  font-size: 10px;
}

/* ---- Reactions ---- */
.msg-reactions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.msg-reaction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-foreground, #fff) 10%, transparent);
  font-size: 12px;
  cursor: pointer;
}

.msg-reaction:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 15%, transparent);
}

/* ---- Input area ---- */
.msg-input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border, #333);
  background: color-mix(in srgb, var(--color-background, #000) 90%, var(--color-foreground, #fff));
}

/* ---- Participants panel ---- */
.msg-participants-panel {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.msg-panel-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px;
}

.msg-participant-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg-participant {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.1s;
}

.msg-participant:hover {
  background: color-mix(in srgb, var(--color-foreground, #fff) 5%, transparent);
}

.msg-participant-info {
  display: flex;
  flex-direction: column;
}

.msg-participant-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.msg-participant-role {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}

/* ---- Status bar spans full width ---- */
.msg-shell > [data-rig-status-bar] {
  grid-column: 1 / -1;
}
</style>
