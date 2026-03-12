/**
 * Anchor Dashboard — Mock invoice + metrics data
 * Theme: Calcite | Archetype: SaaS analytics dashboard
 */
import { businesses } from './briar-cove'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft'

export interface LineItem {
  description: string
  quantity: number
  rate: number
  total: number
}

export interface Invoice {
  id: string
  client: string
  clientName: string
  amount: number
  status: InvoiceStatus
  issued: string
  due: string
  items: LineItem[]
}

export interface DashboardMetrics {
  revenue: { current: number; previous: number; trend: number }
  outstanding: { current: number; count: number }
  overdue: { current: number; count: number }
  clientCount: number
}

export interface MonthlyRevenue {
  month: string
  amount: number
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

export const statusConfig: Record<InvoiceStatus, { label: string; variant: string }> = {
  paid: { label: 'Paid', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  overdue: { label: 'Overdue', variant: 'danger' },
  draft: { label: 'Draft', variant: 'muted' },
}

// ---------------------------------------------------------------------------
// Line item templates
// ---------------------------------------------------------------------------

const lineItemPool: LineItem[] = [
  { description: 'Website Design & Development', quantity: 1, rate: 3500, total: 3500 },
  { description: 'Brand Identity Package', quantity: 1, rate: 2200, total: 2200 },
  { description: 'Monthly SEO Retainer', quantity: 1, rate: 800, total: 800 },
  { description: 'Photography Session (half-day)', quantity: 1, rate: 650, total: 650 },
  { description: 'Social Media Management', quantity: 1, rate: 1200, total: 1200 },
  { description: 'Email Campaign Setup', quantity: 1, rate: 450, total: 450 },
  { description: 'Print Collateral (menus/cards)', quantity: 250, rate: 2.4, total: 600 },
  { description: 'Hosting & Maintenance (annual)', quantity: 1, rate: 960, total: 960 },
  { description: 'Copywriting (per page)', quantity: 5, rate: 150, total: 750 },
  { description: 'Custom Illustration', quantity: 3, rate: 280, total: 840 },
  { description: 'Video Production (60s spot)', quantity: 1, rate: 1800, total: 1800 },
  { description: 'Consultation (hourly)', quantity: 4, rate: 125, total: 500 },
]

function pickItems(seed: number, count: number): LineItem[] {
  const items: LineItem[] = []
  for (let i = 0; i < count; i++) {
    items.push({ ...lineItemPool[(seed + i * 3) % lineItemPool.length]! })
  }
  return items
}

// ---------------------------------------------------------------------------
// Invoice generator
// ---------------------------------------------------------------------------

function generateInvoices(): Invoice[] {
  const statuses: InvoiceStatus[] = ['paid', 'paid', 'paid', 'pending', 'pending', 'overdue', 'draft']
  const invoices: Invoice[] = []

  const baseDate = new Date('2026-01-15')

  for (let i = 0; i < 28; i++) {
    const status = statuses[i % statuses.length]!
    const client = businesses[i % businesses.length]!
    const items = pickItems(i, 2 + (i % 3))
    const amount = items.reduce((sum, li) => sum + li.total, 0)
    const issuedDate = new Date(baseDate)
    issuedDate.setDate(issuedDate.getDate() - (i * 7 + (i % 5) * 3))
    const dueDate = new Date(issuedDate)
    dueDate.setDate(dueDate.getDate() + 30)

    invoices.push({
      id: `INV-2026-${String(847 + i).padStart(4, '0')}`,
      client: client.id,
      clientName: client.name,
      amount,
      status,
      issued: issuedDate.toISOString().slice(0, 10),
      due: dueDate.toISOString().slice(0, 10),
      items,
    })
  }

  return invoices
}

export const invoices: Invoice[] = generateInvoices()

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export const metrics: DashboardMetrics = {
  revenue: {
    current: invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    previous: 42_800,
    get trend() {
      return Math.round(((this.current - this.previous) / this.previous) * 100)
    },
  },
  outstanding: {
    current: invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
    count: invoices.filter((i) => i.status === 'pending').length,
  },
  overdue: {
    current: invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
    count: invoices.filter((i) => i.status === 'overdue').length,
  },
  clientCount: new Set(invoices.map((i) => i.client)).size,
}

// ---------------------------------------------------------------------------
// Monthly revenue (12 months)
// ---------------------------------------------------------------------------

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Mar', amount: 18_400 },
  { month: 'Apr', amount: 22_100 },
  { month: 'May', amount: 19_800 },
  { month: 'Jun', amount: 31_500 },
  { month: 'Jul', amount: 28_200 },
  { month: 'Aug', amount: 24_600 },
  { month: 'Sep', amount: 35_900 },
  { month: 'Oct', amount: 33_100 },
  { month: 'Nov', amount: 29_700 },
  { month: 'Dec', amount: 38_400 },
  { month: 'Jan', amount: 42_800 },
  { month: 'Feb', amount: metrics.revenue.current },
]

// ---------------------------------------------------------------------------
// Table column definitions (for Rig Table)
// ---------------------------------------------------------------------------

export const invoiceColumns = [
  { id: 'id', label: 'Invoice', sortable: true, width: 140 },
  { id: 'clientName', label: 'Client', sortable: true },
  { id: 'amount', label: 'Amount', sortable: true, width: 120, align: 'right' as const },
  { id: 'status', label: 'Status', sortable: true, width: 110 },
  { id: 'issued', label: 'Issued', sortable: true, width: 120 },
  { id: 'due', label: 'Due', sortable: true, width: 120 },
]

// ---------------------------------------------------------------------------
// Context menu actions for table rows
// ---------------------------------------------------------------------------

export const rowActions = [
  { id: 'view', label: 'View Details', icon: 'codicon:eye' },
  { id: 'duplicate', label: 'Duplicate', icon: 'codicon:copy' },
  { id: 'send-reminder', label: 'Send Reminder', icon: 'codicon:mail' },
  { id: 'mark-paid', label: 'Mark as Paid', icon: 'codicon:check' },
  { id: 'separator-1', label: '', icon: '' },
  { id: 'delete', label: 'Delete', icon: 'codicon:trash' },
]
