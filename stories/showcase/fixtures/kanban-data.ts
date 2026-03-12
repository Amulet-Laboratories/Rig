/**
 * Kanban Board — Mock board, column, and card data
 * Theme: VSCode | Archetype: Drag-and-drop column board
 */
import { users, type BriarCoveUser } from './briar-cove-users'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Priority = 'critical' | 'high' | 'medium' | 'low'

export interface KanbanCard {
  id: string
  title: string
  description: string
  priority: Priority
  assignee: BriarCoveUser | null
  tags: string[]
  commentCount: number
  attachmentCount: number
  dueDate: string | null
  created: string
  storyPoints: number | null
}

export interface Column {
  id: string
  title: string
  cards: KanbanCard[]
  limit: number | null
  collapsed: boolean
  color: string
}

export interface Board {
  id: string
  name: string
  columns: Column[]
}

export type ActivityAction =
  | 'created'
  | 'moved'
  | 'commented'
  | 'assigned'
  | 'tagged'
  | 'priority_changed'

export interface Activity {
  id: string
  cardId: string
  user: BriarCoveUser
  action: ActivityAction
  from: string | null
  to: string | null
  timestamp: string
  detail: string | null
}

// ---------------------------------------------------------------------------
// Priority config
// ---------------------------------------------------------------------------

export const priorityConfig: Record<Priority, { label: string; variant: string; icon: string }> = {
  critical: { label: 'Critical', variant: 'error', icon: 'codicon:flame' },
  high: { label: 'High', variant: 'warning', icon: 'codicon:arrow-up' },
  medium: { label: 'Medium', variant: 'info', icon: 'codicon:dash' },
  low: { label: 'Low', variant: 'muted', icon: 'codicon:arrow-down' },
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export const allTags = [
  'backend',
  'frontend',
  'design',
  'billing',
  'infrastructure',
  'documentation',
  'bug',
  'feature',
  'v1.2',
  'v1.3',
]

export const tagColors: Record<string, string> = {
  backend: '#3b82f6',
  frontend: '#8b5cf6',
  design: '#ec4899',
  billing: '#f59e0b',
  infrastructure: '#6b7280',
  documentation: '#10b981',
  bug: '#ef4444',
  feature: '#0891b2',
  'v1.2': '#6366f1',
  'v1.3': '#a855f7',
}

// ---------------------------------------------------------------------------
// Card generation
// ---------------------------------------------------------------------------

const cardDefinitions: Omit<KanbanCard, 'id' | 'created'>[] = [
  // Backlog
  { title: 'Implement invoice PDF export', description: 'Generate downloadable PDF invoices from the invoice detail view. Must include line items, totals, and business branding.', priority: 'high', assignee: users[0]!, tags: ['backend', 'billing', 'v1.2'], commentCount: 5, attachmentCount: 1, dueDate: '2026-03-28', storyPoints: 8 },
  { title: 'Add recurring invoice support', description: 'Allow businesses to set invoices on a monthly/quarterly/annual schedule with auto-generation.', priority: 'medium', assignee: null, tags: ['backend', 'billing', 'v1.3'], commentCount: 2, attachmentCount: 0, dueDate: null, storyPoints: 13 },
  { title: 'Client portal read-only view', description: 'Public-facing page where clients can view their invoice history and outstanding balances.', priority: 'medium', assignee: null, tags: ['frontend', 'feature'], commentCount: 0, attachmentCount: 0, dueDate: null, storyPoints: 8 },
  { title: 'Multi-currency support', description: 'Display and calculate invoices in USD, EUR, GBP, CAD. Store exchange rates.', priority: 'low', assignee: null, tags: ['backend', 'billing'], commentCount: 1, attachmentCount: 0, dueDate: null, storyPoints: 5 },
  { title: 'Audit log for invoice changes', description: 'Track who changed what on each invoice. Immutable log entries.', priority: 'low', assignee: null, tags: ['backend', 'infrastructure'], commentCount: 0, attachmentCount: 0, dueDate: null, storyPoints: 5 },
  { title: 'Client contact import from CSV', description: 'Bulk import client data from CSV files with column mapping and validation preview.', priority: 'low', assignee: null, tags: ['frontend', 'feature'], commentCount: 0, attachmentCount: 0, dueDate: null, storyPoints: 5 },
  { title: 'Email template editor', description: 'WYSIWYG editor for invoice email templates with merge fields.', priority: 'low', assignee: null, tags: ['frontend', 'design', 'v1.3'], commentCount: 3, attachmentCount: 2, dueDate: null, storyPoints: 8 },
  { title: 'Automated payment reminders', description: 'Send email reminders N days before/after due date. Configurable schedule per client.', priority: 'medium', assignee: null, tags: ['backend', 'billing', 'v1.3'], commentCount: 1, attachmentCount: 0, dueDate: null, storyPoints: 5 },

  // To Do
  { title: 'Dashboard chart hover tooltips', description: 'Add interactive tooltips on chart data points showing exact values and date range.', priority: 'medium', assignee: users[6]!, tags: ['frontend', 'design'], commentCount: 4, attachmentCount: 1, dueDate: '2026-03-20', storyPoints: 3 },
  { title: 'Fix invoice sorting by amount', description: 'Table sort on amount column treats values as strings. Needs numeric comparison.', priority: 'high', assignee: users[10]!, tags: ['frontend', 'bug'], commentCount: 2, attachmentCount: 0, dueDate: '2026-03-15', storyPoints: 1 },
  { title: 'Add client industry filter', description: 'DropdownMenu filter on client list to narrow by industry category.', priority: 'medium', assignee: users[4]!, tags: ['frontend', 'feature'], commentCount: 0, attachmentCount: 0, dueDate: '2026-03-22', storyPoints: 2 },
  { title: 'Accessibility audit — keyboard nav', description: 'Run full WCAG AAA audit. Fix tab order, focus traps, and screen reader labels.', priority: 'high', assignee: users[11]!, tags: ['frontend', 'documentation'], commentCount: 6, attachmentCount: 3, dueDate: '2026-03-25', storyPoints: 5 },

  // In Progress
  { title: 'Revenue comparison chart', description: 'Side-by-side monthly bar chart comparing current vs previous period. Click to drill down.', priority: 'high', assignee: users[1]!, tags: ['frontend', 'feature', 'v1.2'], commentCount: 8, attachmentCount: 2, dueDate: '2026-03-14', storyPoints: 5 },
  { title: 'Client detail page redesign', description: 'New layout with contact info card, invoice history table, and revenue sparkline.', priority: 'medium', assignee: users[4]!, tags: ['frontend', 'design', 'v1.2'], commentCount: 12, attachmentCount: 5, dueDate: '2026-03-18', storyPoints: 8 },
  { title: 'Stripe webhook integration', description: 'Listen for payment events from Stripe. Auto-update invoice status on payment receipt.', priority: 'critical', assignee: users[6]!, tags: ['backend', 'billing', 'infrastructure'], commentCount: 15, attachmentCount: 1, dueDate: '2026-03-12', storyPoints: 8 },
  { title: 'Settings page — user preferences', description: 'Theme, language, date format, default currency, notification preferences.', priority: 'medium', assignee: users[3]!, tags: ['frontend', 'feature'], commentCount: 3, attachmentCount: 0, dueDate: '2026-03-16', storyPoints: 5 },

  // Review
  { title: 'Status badge color system', description: 'Semantic badge colors for paid/pending/overdue/draft. Hex token integration.', priority: 'medium', assignee: users[7]!, tags: ['frontend', 'design'], commentCount: 7, attachmentCount: 1, dueDate: null, storyPoints: 3 },
  { title: 'Invoice line item CRUD', description: 'Add/edit/remove line items with inline editing. Auto-calculate totals.', priority: 'high', assignee: users[1]!, tags: ['frontend', 'billing', 'v1.2'], commentCount: 10, attachmentCount: 0, dueDate: null, storyPoints: 5 },
  { title: 'API rate limiting middleware', description: 'Per-client rate limiting with configurable thresholds and 429 responses.', priority: 'medium', assignee: users[10]!, tags: ['backend', 'infrastructure'], commentCount: 2, attachmentCount: 0, dueDate: null, storyPoints: 3 },

  // Done
  { title: 'Initial dashboard layout', description: 'ShellGrid + Tabs + StatusBar skeleton for the main analytics view.', priority: 'high', assignee: users[0]!, tags: ['frontend', 'feature', 'v1.2'], commentCount: 14, attachmentCount: 3, dueDate: null, storyPoints: 5 },
  { title: 'Database schema design', description: 'PostgreSQL schema for clients, invoices, line items, payments, and audit logs.', priority: 'critical', assignee: users[6]!, tags: ['backend', 'infrastructure'], commentCount: 20, attachmentCount: 4, dueDate: null, storyPoints: 8 },
  { title: 'Authentication flow', description: 'Email/password login with JWT refresh tokens. Password reset flow.', priority: 'critical', assignee: users[10]!, tags: ['backend', 'infrastructure'], commentCount: 18, attachmentCount: 2, dueDate: null, storyPoints: 13 },
  { title: 'Client CRUD API', description: 'REST endpoints for creating, reading, updating, and archiving clients.', priority: 'high', assignee: users[3]!, tags: ['backend', 'feature'], commentCount: 8, attachmentCount: 0, dueDate: null, storyPoints: 5 },
  { title: 'Invoice CRUD API', description: 'REST endpoints for invoice lifecycle. Includes status transitions and line items.', priority: 'high', assignee: users[1]!, tags: ['backend', 'billing'], commentCount: 12, attachmentCount: 1, dueDate: null, storyPoints: 8 },
  { title: 'Hex theme integration', description: 'Wire Obelisk/Calcite themes via CSS custom properties. Scaffold theme switcher.', priority: 'medium', assignee: users[7]!, tags: ['frontend', 'design'], commentCount: 6, attachmentCount: 0, dueDate: null, storyPoints: 3 },
  { title: 'CI/CD pipeline setup', description: 'GitHub Actions: lint, test, build, deploy preview. Netlify integration.', priority: 'high', assignee: users[10]!, tags: ['infrastructure', 'documentation'], commentCount: 5, attachmentCount: 1, dueDate: null, storyPoints: 5 },
  { title: 'Component library evaluation', description: 'Evaluated shadcn, Radix, Headless UI. Decision: build Rig as custom headless lib.', priority: 'medium', assignee: users[0]!, tags: ['documentation', 'design'], commentCount: 22, attachmentCount: 6, dueDate: null, storyPoints: 3 },
  { title: 'Toast notification system', description: 'useToast composable with severity levels, auto-dismiss, and stacking.', priority: 'medium', assignee: users[4]!, tags: ['frontend', 'feature'], commentCount: 4, attachmentCount: 0, dueDate: null, storyPoints: 3 },
  { title: 'Empty state illustrations', description: 'SVG illustrations for empty tables, no search results, and onboarding.', priority: 'low', assignee: users[9]!, tags: ['design', 'frontend'], commentCount: 3, attachmentCount: 8, dueDate: null, storyPoints: 2 },
]

function generateCards(): KanbanCard[] {
  const baseDate = new Date('2026-02-01')
  return cardDefinitions.map((def, i) => {
    const created = new Date(baseDate)
    created.setDate(created.getDate() + i * 2)
    return {
      ...def,
      id: `ANC-${String(100 + i).padStart(3, '0')}`,
      created: created.toISOString().slice(0, 10),
    }
  })
}

const allCards = generateCards()

// ---------------------------------------------------------------------------
// Board
// ---------------------------------------------------------------------------

export const board: Board = {
  id: 'anchor-sprint-4',
  name: 'Anchor — Sprint 4',
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      cards: allCards.slice(0, 8),
      limit: null,
      collapsed: false,
      color: '#6b7280',
    },
    {
      id: 'todo',
      title: 'To Do',
      cards: allCards.slice(8, 12),
      limit: null,
      collapsed: false,
      color: '#3b82f6',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: allCards.slice(12, 16),
      limit: 4,
      collapsed: false,
      color: '#f59e0b',
    },
    {
      id: 'review',
      title: 'Review',
      cards: allCards.slice(16, 19),
      limit: null,
      collapsed: false,
      color: '#8b5cf6',
    },
    {
      id: 'done',
      title: 'Done',
      cards: allCards.slice(19),
      limit: null,
      collapsed: false,
      color: '#22c55e',
    },
  ],
}

// ---------------------------------------------------------------------------
// Column table view (for Table toggle)
// ---------------------------------------------------------------------------

export const tableColumns = [
  { id: 'id', label: 'ID', sortable: true, width: 100 },
  { id: 'title', label: 'Title', sortable: true },
  { id: 'priority', label: 'Priority', sortable: true, width: 100 },
  { id: 'assignee', label: 'Assignee', sortable: true, width: 150 },
  { id: 'status', label: 'Status', sortable: true, width: 120 },
  { id: 'tags', label: 'Tags', sortable: false, width: 200 },
  { id: 'points', label: 'Points', sortable: true, width: 70, align: 'right' as const },
]

// ---------------------------------------------------------------------------
// Activity log
// ---------------------------------------------------------------------------

export const activities: Activity[] = [
  { id: 'act-001', cardId: 'ANC-112', user: users[6]!, action: 'moved', from: 'To Do', to: 'In Progress', timestamp: '2026-03-11T09:15:00Z', detail: null },
  { id: 'act-002', cardId: 'ANC-112', user: users[1]!, action: 'commented', from: null, to: null, timestamp: '2026-03-11T08:45:00Z', detail: 'Stripe test keys are configured. Starting webhook listener implementation.' },
  { id: 'act-003', cardId: 'ANC-114', user: users[6]!, action: 'assigned', from: null, to: 'Jasper Cole', timestamp: '2026-03-10T16:30:00Z', detail: null },
  { id: 'act-004', cardId: 'ANC-110', user: users[4]!, action: 'tagged', from: null, to: 'design', timestamp: '2026-03-10T14:20:00Z', detail: null },
  { id: 'act-005', cardId: 'ANC-116', user: users[7]!, action: 'priority_changed', from: 'medium', to: 'high', timestamp: '2026-03-10T11:00:00Z', detail: null },
  { id: 'act-006', cardId: 'ANC-113', user: users[4]!, action: 'commented', from: null, to: null, timestamp: '2026-03-09T17:30:00Z', detail: 'Updated mockups attached. Reduced the sidebar width and added a sparkline to the client card.' },
  { id: 'act-007', cardId: 'ANC-119', user: users[0]!, action: 'moved', from: 'Review', to: 'Done', timestamp: '2026-03-09T15:20:00Z', detail: null },
  { id: 'act-008', cardId: 'ANC-120', user: users[6]!, action: 'created', from: null, to: null, timestamp: '2026-03-09T10:00:00Z', detail: null },
  { id: 'act-009', cardId: 'ANC-121', user: users[10]!, action: 'moved', from: 'In Progress', to: 'Done', timestamp: '2026-03-08T18:45:00Z', detail: null },
  { id: 'act-010', cardId: 'ANC-117', user: users[1]!, action: 'commented', from: null, to: null, timestamp: '2026-03-08T14:15:00Z', detail: 'Draft API review looks good. Let me test the bulk update endpoint.' },
  { id: 'act-011', cardId: 'ANC-125', user: users[10]!, action: 'moved', from: 'In Progress', to: 'Done', timestamp: '2026-03-07T16:00:00Z', detail: null },
  { id: 'act-012', cardId: 'ANC-109', user: users[10]!, action: 'assigned', from: null, to: 'Rowan Blackwood', timestamp: '2026-03-07T09:30:00Z', detail: null },
  { id: 'act-013', cardId: 'ANC-126', user: users[7]!, action: 'created', from: null, to: null, timestamp: '2026-03-06T11:20:00Z', detail: null },
  { id: 'act-014', cardId: 'ANC-127', user: users[4]!, action: 'moved', from: 'In Progress', to: 'Done', timestamp: '2026-03-06T09:00:00Z', detail: null },
  { id: 'act-015', cardId: 'ANC-111', user: users[11]!, action: 'commented', from: null, to: null, timestamp: '2026-03-05T15:30:00Z', detail: 'Initial audit complete. 14 issues found — 3 critical (missing ARIA labels on modals).' },
  { id: 'act-016', cardId: 'ANC-100', user: users[0]!, action: 'commented', from: null, to: null, timestamp: '2026-03-05T10:00:00Z', detail: 'Need to support both letter and A4 page sizes for the PDF.' },
  { id: 'act-017', cardId: 'ANC-128', user: users[9]!, action: 'moved', from: 'Review', to: 'Done', timestamp: '2026-03-04T17:30:00Z', detail: null },
  { id: 'act-018', cardId: 'ANC-124', user: users[0]!, action: 'moved', from: 'In Progress', to: 'Done', timestamp: '2026-03-04T14:00:00Z', detail: null },
  { id: 'act-019', cardId: 'ANC-115', user: users[3]!, action: 'commented', from: null, to: null, timestamp: '2026-03-03T16:45:00Z', detail: 'Settings page skeleton merged. Starting on individual preference sections.' },
  { id: 'act-020', cardId: 'ANC-112', user: users[6]!, action: 'priority_changed', from: 'high', to: 'critical', timestamp: '2026-03-03T09:00:00Z', detail: null },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getColumnForCard(boardState: Board, cardId: string): Column | undefined {
  return boardState.columns.find((col) => col.cards.some((c) => c.id === cardId))
}

export function getAllCards(boardState: Board): (KanbanCard & { status: string })[] {
  return boardState.columns.flatMap((col) =>
    col.cards.map((card) => ({ ...card, status: col.title })),
  )
}

export function getCardStats(boardState: Board) {
  const total = boardState.columns.reduce((sum, col) => sum + col.cards.length, 0)
  const byColumn = Object.fromEntries(
    boardState.columns.map((col) => [col.id, col.cards.length]),
  )
  return { total, byColumn }
}
