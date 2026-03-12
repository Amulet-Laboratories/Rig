/**
 * Messaging App — Chat conversations, contacts, and messages
 * Theme: Obsidian | Archetype: Real-time messaging interface
 */
import { users, type BriarCoveUser } from './briar-cove-users'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string // ISO datetime
  read: boolean
  reactions: { emoji: string; userId: string }[]
  replyTo: string | null
  attachments: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: 'image' | 'file' | 'link'
  size: string
  url: string
}

export interface Conversation {
  id: string
  name: string
  isGroup: boolean
  participants: BriarCoveUser[]
  messages: Message[]
  lastActivity: string
  unreadCount: number
  pinned: boolean
  muted: boolean
}

export interface Channel {
  id: string
  name: string
  description: string
  icon: string
  unreadCount: number
}

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

export const channels: Channel[] = [
  { id: 'ch-general', name: 'general', description: 'General team chat', icon: 'codicon:comment-discussion', unreadCount: 3 },
  { id: 'ch-engineering', name: 'engineering', description: 'Engineering discussion', icon: 'codicon:tools', unreadCount: 0 },
  { id: 'ch-design', name: 'design', description: 'Design feedback and reviews', icon: 'codicon:symbol-color', unreadCount: 1 },
  { id: 'ch-announcements', name: 'announcements', description: 'Team announcements', icon: 'codicon:megaphone', unreadCount: 0 },
  { id: 'ch-random', name: 'random', description: 'Off-topic and fun stuff', icon: 'codicon:smiley', unreadCount: 5 },
]

// ---------------------------------------------------------------------------
// Helper: generate a msg ID
// ---------------------------------------------------------------------------
let msgCounter = 0
function msgId(): string {
  return `msg-${String(++msgCounter).padStart(3, '0')}`
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

const engineeringMessages: Message[] = [
  { id: msgId(), senderId: users[6]!.id, text: 'Stripe webhook is live in staging. Can someone test the payment flow?', timestamp: '2026-03-11T09:12:00Z', read: true, reactions: [{ emoji: '🎉', userId: users[0]!.id }], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[10]!.id, text: 'On it. I\'ll run through the full payment cycle and check the invoice status updates.', timestamp: '2026-03-11T09:14:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[0]!.id, text: 'Also, the PDF export PR needs a review. Added A4 and Letter format support.', timestamp: '2026-03-11T09:18:00Z', read: true, reactions: [], replyTo: null, attachments: [{ id: 'att-001', name: 'invoice-sample.pdf', type: 'file', size: '245 KB', url: '#' }] },
  { id: msgId(), senderId: users[1]!.id, text: 'I\'ll review the PDF PR this afternoon. Quick question — does it support custom branding per client?', timestamp: '2026-03-11T09:22:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[0]!.id, text: 'Not yet. That\'s planned for v1.3. Right now it uses the default Anchor branding.', timestamp: '2026-03-11T09:24:00Z', read: true, reactions: [{ emoji: '👍', userId: users[1]!.id }], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[6]!.id, text: '📊 Staging test results are in. 4/5 webhooks processed correctly. The `invoice.payment_failed` event isn\'t triggering the retry logic.', timestamp: '2026-03-11T10:05:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[10]!.id, text: 'Found the issue — the event type check is case-sensitive. Stripe sends `invoice.payment_failed` but we\'re matching `INVOICE.PAYMENT_FAILED`.', timestamp: '2026-03-11T10:15:00Z', read: true, reactions: [{ emoji: '🔍', userId: users[6]!.id }], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[6]!.id, text: 'Good catch. Pushing a fix now.', timestamp: '2026-03-11T10:17:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[3]!.id, text: 'Settings page is coming along. Just finished the notification preferences section. Here\'s a preview:', timestamp: '2026-03-11T11:30:00Z', read: true, reactions: [{ emoji: '✨', userId: users[4]!.id }, { emoji: '👀', userId: users[0]!.id }], replyTo: null, attachments: [{ id: 'att-002', name: 'settings-preview.png', type: 'image', size: '1.2 MB', url: '#' }] },
  { id: msgId(), senderId: users[4]!.id, text: 'Looks great Dorian. The toggle alignment could use a tiny tweak — the labels aren\'t quite baseline-aligned with the switches.', timestamp: '2026-03-11T11:35:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[11]!.id, text: 'Hey everyone, accessibility audit update: down to 6 issues from 14. The modal focus trap fix resolved 5 of them. Still working on the remaining screen reader labels.', timestamp: '2026-03-11T14:00:00Z', read: false, reactions: [{ emoji: '💪', userId: users[0]!.id }], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[0]!.id, text: 'Amazing progress Ivy. Let me know if you need help with any of the remaining items.', timestamp: '2026-03-11T14:05:00Z', read: false, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[1]!.id, text: 'Revenue chart is ready for final review. Added the drill-down interaction — click any bar to see daily breakdown.', timestamp: '2026-03-11T15:20:00Z', read: false, reactions: [], replyTo: null, attachments: [] },
]

const designMessages: Message[] = [
  { id: msgId(), senderId: users[4]!.id, text: 'Updated the client detail page mockups. Reduced sidebar width and added a revenue sparkline.', timestamp: '2026-03-10T16:00:00Z', read: true, reactions: [{ emoji: '🎨', userId: users[7]!.id }], replyTo: null, attachments: [{ id: 'att-003', name: 'client-detail-v3.fig', type: 'file', size: '4.8 MB', url: '#' }] },
  { id: msgId(), senderId: users[7]!.id, text: 'The sparkline is a nice touch. Should we use the same component for the dashboard cards?', timestamp: '2026-03-10T16:15:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[4]!.id, text: 'Yes, I think consistency there makes sense. I\'ll add it to the component spec.', timestamp: '2026-03-10T16:20:00Z', read: true, reactions: [{ emoji: '👍', userId: users[7]!.id }], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[9]!.id, text: 'Empty state illustrations are done. 8 SVGs total — tables, search, onboarding, errors, and more. Uploading to the shared drive now.', timestamp: '2026-03-11T10:00:00Z', read: true, reactions: [{ emoji: '🖼️', userId: users[4]!.id }, { emoji: '🎉', userId: users[0]!.id }], replyTo: null, attachments: [{ id: 'att-004', name: 'empty-states.zip', type: 'file', size: '2.1 MB', url: '#' }] },
  { id: msgId(), senderId: users[7]!.id, text: 'Status badge colors finalized. Using semantic tokens from Hex — paid=success, pending=warning, overdue=error, draft=muted. PR is up.', timestamp: '2026-03-11T13:00:00Z', read: false, reactions: [], replyTo: null, attachments: [] },
]

const directMessages: Message[] = [
  { id: msgId(), senderId: users[0]!.id, text: 'Hey Marcus, do you have bandwidth to pair on the revenue chart this afternoon?', timestamp: '2026-03-11T08:30:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[1]!.id, text: 'Sure thing. I\'m free after 2pm. Should we use the comparison layout we discussed?', timestamp: '2026-03-11T08:35:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[0]!.id, text: 'Yeah, side-by-side bars with the previous period in a lighter shade. I\'ll pull up the mockup.', timestamp: '2026-03-11T08:37:00Z', read: true, reactions: [{ emoji: '👍', userId: users[1]!.id }], replyTo: null, attachments: [] },
  { id: msgId(), senderId: users[1]!.id, text: 'Perfect. See you at 2.', timestamp: '2026-03-11T08:38:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
]

export const conversations: Conversation[] = [
  {
    id: 'conv-engineering',
    name: 'engineering',
    isGroup: true,
    participants: [users[0]!, users[1]!, users[3]!, users[4]!, users[6]!, users[10]!, users[11]!],
    messages: engineeringMessages,
    lastActivity: '2026-03-11T15:20:00Z',
    unreadCount: 3,
    pinned: true,
    muted: false,
  },
  {
    id: 'conv-design',
    name: 'design',
    isGroup: true,
    participants: [users[4]!, users[7]!, users[9]!, users[0]!],
    messages: designMessages,
    lastActivity: '2026-03-11T13:00:00Z',
    unreadCount: 1,
    pinned: false,
    muted: false,
  },
  {
    id: 'conv-marcus',
    name: 'Marcus Thorne',
    isGroup: false,
    participants: [users[0]!, users[1]!],
    messages: directMessages,
    lastActivity: '2026-03-11T08:38:00Z',
    unreadCount: 0,
    pinned: false,
    muted: false,
  },
  {
    id: 'conv-sable',
    name: 'Sable Aldridge',
    isGroup: false,
    participants: [users[0]!, users[2]!],
    messages: [
      { id: msgId(), senderId: users[2]!.id, text: 'Quarterly tax estimate is ready. Want me to send it to the accountant directly?', timestamp: '2026-03-10T14:00:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
      { id: msgId(), senderId: users[0]!.id, text: 'Yes please. CC me on the email.', timestamp: '2026-03-10T14:10:00Z', read: true, reactions: [{ emoji: '✅', userId: users[2]!.id }], replyTo: null, attachments: [] },
    ],
    lastActivity: '2026-03-10T14:10:00Z',
    unreadCount: 0,
    pinned: false,
    muted: false,
  },
  {
    id: 'conv-team-lunch',
    name: 'Team Lunch Planning',
    isGroup: true,
    participants: [users[0]!, users[2]!, users[4]!, users[8]!],
    messages: [
      { id: msgId(), senderId: users[8]!.id, text: 'How about Briar Cove Diner again? The calamari was fantastic last time.', timestamp: '2026-03-09T16:00:00Z', read: true, reactions: [{ emoji: '🦑', userId: users[2]!.id }], replyTo: null, attachments: [] },
      { id: msgId(), senderId: users[4]!.id, text: 'I\'m in. Can we do Friday this time? Thursday is packed with reviews.', timestamp: '2026-03-09T16:10:00Z', read: true, reactions: [], replyTo: null, attachments: [] },
      { id: msgId(), senderId: users[0]!.id, text: 'Friday works. I\'ll make the reservation. 12pm?', timestamp: '2026-03-09T16:15:00Z', read: true, reactions: [{ emoji: '👍', userId: users[4]!.id }, { emoji: '👍', userId: users[8]!.id }], replyTo: null, attachments: [] },
    ],
    lastActivity: '2026-03-09T16:15:00Z',
    unreadCount: 0,
    pinned: false,
    muted: true,
  },
]

// ---------------------------------------------------------------------------
// The "current user" for the messaging app
// ---------------------------------------------------------------------------

export const currentUser = users[0]!

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function formatConversationTime(iso: string): string {
  const d = new Date(iso)
  const today = new Date(2026, 2, 11) // demo "today"
  if (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  ) {
    return formatMessageTime(iso)
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getOtherParticipant(conv: Conversation): BriarCoveUser | null {
  if (conv.isGroup) return null
  return conv.participants.find((p) => p.id !== currentUser.id) ?? null
}

export function getLastMessage(conv: Conversation): Message | null {
  return conv.messages[conv.messages.length - 1] ?? null
}

export function getSenderName(senderId: string): string {
  const user = users.find((u) => u.id === senderId)
  return user?.name ?? 'Unknown'
}

export function getUserById(id: string): BriarCoveUser | undefined {
  return users.find((u) => u.id === id)
}
