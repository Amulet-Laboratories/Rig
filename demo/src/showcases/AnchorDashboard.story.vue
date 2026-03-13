<script setup lang="ts">
/**
 * Anchor Dashboard — SaaS analytics dashboard showcase
 * Theme: Calcite | Exercises: core, lists, menus, nav, layout, extras
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import Input from '@core/primitives/Input.vue'
import Select from '@core/primitives/Select.vue'
import Tabs from '@nav/Tabs.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import StatusBar from '@nav/StatusBar.vue'
import Table from '@lists/Table.vue'
import ContextMenu from '@menus/ContextMenu.vue'
import Modal from '@layout/Modal.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'

import { toast } from '@extras/useToast'

// ---- Mock Data ----
import {
  invoices,
  metrics,
  monthlyRevenue,
  invoiceColumns,
  rowActions,
  statusConfig,
  type Invoice,
  type InvoiceStatus,
} from './fixtures/anchor-data'
import { businesses } from './fixtures/briar-cove'

import type { Action, SortState } from '@core/types'

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', label: 'Overview', icon: 'codicon:graph' },
  { id: 'invoices', label: 'Invoices', icon: 'codicon:file-text' },
  { id: 'clients', label: 'Clients', icon: 'codicon:organization' },
]

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
const breadcrumbs = computed(() => {
  const items = [{ id: 'home', label: 'Anchor' }]
  const tab = tabs.find((t) => t.id === activeTab.value)
  if (tab) items.push({ id: tab.id, label: tab.label })
  return items
})

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
const searchQuery = ref('')
const statusFilter = ref<InvoiceStatus | ''>('')
const clientFilter = ref('')

const statusOptions = [
  { id: '', label: 'All Statuses' },
  { id: 'paid', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'draft', label: 'Draft' },
]

const clientOptions = [
  { id: '', label: 'All Clients' },
  ...businesses.map((b) => ({ id: b.id, label: b.name })),
]

const hasActiveFilters = computed(
  () => searchQuery.value !== '' || statusFilter.value !== '' || clientFilter.value !== '',
)

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  clientFilter.value = ''
}

// ---------------------------------------------------------------------------
// Table sorting & filtering
// ---------------------------------------------------------------------------
const sort = ref<SortState>({ column: 'issued', direction: 'desc' })

const filteredInvoices = computed(() => {
  let result = [...invoices]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (inv) =>
        inv.id.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q),
    )
  }
  if (statusFilter.value) {
    result = result.filter((inv) => inv.status === statusFilter.value)
  }
  if (clientFilter.value) {
    result = result.filter((inv) => inv.client === clientFilter.value)
  }

  // Sort
  const col = sort.value.column
  const dir = sort.value.direction === 'asc' ? 1 : -1
  result.sort((a, b) => {
    const av = a[col as keyof Invoice]
    const bv = b[col as keyof Invoice]
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av).localeCompare(String(bv)) * dir
  })

  return result
})

// ---------------------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------------------
const ctxOpen = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)
const ctxInvoice = ref<Invoice | null>(null)

function onRowContext(row: Invoice, event: MouseEvent) {
  event.preventDefault()
  ctxInvoice.value = row
  ctxX.value = event.clientX
  ctxY.value = event.clientY
  ctxOpen.value = true
}

// Expose for template reference (used by ContextMenu integration)
void onRowContext

function onCtxSelect(action: Action) {
  ctxOpen.value = false
  if (!ctxInvoice.value) return

  if (action.id === 'mark-paid') {
    const inv = invoices.find((i) => i.id === ctxInvoice.value!.id)
    if (inv) inv.status = 'paid'
    toast.add({ message: `${ctxInvoice.value.id} marked as paid`, variant: 'success' })
  } else if (action.id === 'send-reminder') {
    toast.add({ message: `Reminder sent for ${ctxInvoice.value.id}`, variant: 'info' })
  } else if (action.id === 'duplicate') {
    toast.add({ message: `${ctxInvoice.value.id} duplicated`, variant: 'info' })
  } else if (action.id === 'delete') {
    toast.add({ message: `${ctxInvoice.value.id} deleted`, variant: 'error' })
  } else if (action.id === 'view') {
    detailInvoice.value = ctxInvoice.value
    detailOpen.value = true
  }
}

// ---------------------------------------------------------------------------
// Detail modal
// ---------------------------------------------------------------------------
const detailOpen = ref(false)
const detailInvoice = ref<Invoice | null>(null)

function openDetail(row: Invoice) {
  detailInvoice.value = row
  detailOpen.value = true
}

// ---------------------------------------------------------------------------
// Show empty state toggle (for story variant)
// ---------------------------------------------------------------------------
const showEmpty = ref(false)

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = [
  { id: 'total', content: `${invoices.length} invoices`, priority: 1, align: 'left' as const },
  { id: 'revenue', content: `$${metrics.revenue.current.toLocaleString()} revenue`, priority: 2, align: 'right' as const },
  { id: 'clients', content: `${metrics.clientCount} clients`, priority: 3, align: 'right' as const },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function trendIcon(trend: number): string {
  return trend >= 0 ? 'codicon:arrow-up' : 'codicon:arrow-down'
}

// Revenue bar chart max for scaling
const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.amount))
</script>

<template>
  <Story title="Anchor Dashboard" icon="codicon:dashboard" group="showcase">
    <Variant title="Default">
      <div class="anchor-shell" data-theme="calcite">
        <!-- Top navigation -->
        <header class="anchor-topbar">
          <div class="anchor-topbar-left">
            <Icon icon="codicon:symbol-misc" size="lg" label="Anchor" />
            <span class="anchor-brand">Anchor</span>
            <Breadcrumbs :items="breadcrumbs" />
          </div>
          <div class="anchor-topbar-right">
            <Input
              v-model="searchQuery"
              placeholder="Search invoices..."
              clearable
              :debounce="200"
            >
              <template #leading>
                <Icon icon="codicon:search" size="sm" />
              </template>
            </Input>
          </div>
        </header>

        <!-- Tab navigation -->
        <Tabs v-model="activeTab">
          <template #tabs="{ isActive, activate }">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              role="tab"
              :aria-selected="isActive(tab.id)"
              :data-active="isActive(tab.id) || undefined"
              class="anchor-tab"
              @click="activate(tab.id)"
            >
              <Icon :icon="tab.icon" size="sm" />
              {{ tab.label }}
            </button>
          </template>

          <template #default="{ activeId }">
            <!-- ============ OVERVIEW TAB ============ -->
            <div v-if="activeId === 'overview'" class="anchor-content">
              <!-- Metric cards -->
              <div class="anchor-metrics">
                <Card>
                  <div class="metric-card">
                    <span class="metric-label">Revenue (this month)</span>
                    <span class="metric-value">{{ formatCurrency(metrics.revenue.current) }}</span>
                    <span class="metric-trend" :data-positive="metrics.revenue.trend >= 0 || undefined">
                      <Icon :icon="trendIcon(metrics.revenue.trend)" size="xs" />
                      {{ Math.abs(metrics.revenue.trend) }}% vs last month
                    </span>
                  </div>
                </Card>
                <Card>
                  <div class="metric-card">
                    <span class="metric-label">Outstanding</span>
                    <span class="metric-value">{{ formatCurrency(metrics.outstanding.current) }}</span>
                    <span class="metric-count">{{ metrics.outstanding.count }} invoices</span>
                  </div>
                </Card>
                <Card>
                  <div class="metric-card">
                    <span class="metric-label">Overdue</span>
                    <span class="metric-value metric-danger">{{ formatCurrency(metrics.overdue.current) }}</span>
                    <span class="metric-count">{{ metrics.overdue.count }} invoices</span>
                  </div>
                </Card>
                <Card>
                  <div class="metric-card">
                    <span class="metric-label">Active Clients</span>
                    <span class="metric-value">{{ metrics.clientCount }}</span>
                    <span class="metric-count">across all projects</span>
                  </div>
                </Card>
              </div>

              <!-- Revenue chart -->
              <Card>
                <div class="revenue-chart">
                  <h3 class="section-title">Monthly Revenue</h3>
                  <div class="bar-chart">
                    <div
                      v-for="m in monthlyRevenue"
                      :key="m.month"
                      class="bar-column"
                    >
                      <div
                        class="bar-fill"
                        :style="{ height: `${(m.amount / maxRevenue) * 100}%` }"
                        :title="formatCurrency(m.amount)"
                      />
                      <span class="bar-label">{{ m.month }}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- Recent invoices preview -->
              <Card>
                <div class="recent-section">
                  <div class="section-header">
                    <h3 class="section-title">Recent Invoices</h3>
                    <Button variant="ghost" size="sm" @click="activeTab = 'invoices'">
                      View All
                    </Button>
                  </div>
                  <Table
                    :columns="invoiceColumns"
                    :rows="(filteredInvoices.slice(0, 5) as unknown as Record<string, unknown>[])"
                    :sort="sort"
                    row-key="id"
                    @update:sort="sort = $event"
                    @row-click="openDetail($event as unknown as Invoice)"
                    @contextmenu.prevent=""
                  >
                    <template #cell-amount="{ value }">
                      {{ formatCurrency(value as number) }}
                    </template>
                    <template #cell-status="{ value }">
                      <Badge :variant="statusConfig[value as InvoiceStatus].variant">
                        {{ statusConfig[value as InvoiceStatus].label }}
                      </Badge>
                    </template>
                    <template #cell-issued="{ value }">
                      {{ formatDate(value as string) }}
                    </template>
                    <template #cell-due="{ value }">
                      {{ formatDate(value as string) }}
                    </template>
                  </Table>
                </div>
              </Card>
            </div>

            <!-- ============ INVOICES TAB ============ -->
            <div v-else-if="activeId === 'invoices'" class="anchor-content">
              <!-- Filter bar -->
              <div class="filter-bar">
                <Select
                  v-model="statusFilter"
                  :options="statusOptions"
                  aria-label="Filter by status"
                />
                <Select
                  v-model="clientFilter"
                  :options="clientOptions"
                  aria-label="Filter by client"
                />
                <Button
                  v-if="hasActiveFilters"
                  variant="ghost"
                  size="sm"
                  @click="clearFilters"
                >
                  <Icon icon="codicon:close" size="sm" />
                  Clear Filters
                </Button>
                <div class="filter-spacer" />
                <Button variant="primary" size="sm">
                  <Icon icon="codicon:add" size="sm" />
                  New Invoice
                </Button>
              </div>

              <!-- Filter chips -->
              <div v-if="hasActiveFilters" class="filter-chips">
                <Badge v-if="statusFilter" variant="info">
                  Status: {{ statusConfig[statusFilter].label }}
                  <button class="chip-remove" @click="statusFilter = ''">&times;</button>
                </Badge>
                <Badge v-if="clientFilter" variant="info">
                  Client: {{ businesses.find(b => b.id === clientFilter)?.name }}
                  <button class="chip-remove" @click="clientFilter = ''">&times;</button>
                </Badge>
                <Badge v-if="searchQuery" variant="info">
                  Search: "{{ searchQuery }}"
                  <button class="chip-remove" @click="searchQuery = ''">&times;</button>
                </Badge>
              </div>

              <!-- Invoice table or empty state -->
              <template v-if="!showEmpty && filteredInvoices.length > 0">
                <Table
                  :columns="invoiceColumns"
                  :rows="(filteredInvoices as unknown as Record<string, unknown>[])"
                  :sort="sort"
                  row-key="id"
                  @update:sort="sort = $event"
                  @row-click="openDetail($event as unknown as Invoice)"
                >
                  <template #cell-amount="{ value }">
                    {{ formatCurrency(value as number) }}
                  </template>
                  <template #cell-status="{ value }">
                    <Badge :variant="statusConfig[value as InvoiceStatus].variant">
                      {{ statusConfig[value as InvoiceStatus].label }}
                    </Badge>
                  </template>
                  <template #cell-issued="{ value }">
                    {{ formatDate(value as string) }}
                  </template>
                  <template #cell-due="{ value }">
                    {{ formatDate(value as string) }}
                  </template>
                </Table>
              </template>

              <EmptyState
                v-else
                title="No invoices yet"
                description="Create your first invoice to start tracking revenue."
                icon="codicon:file-text"
              >
                <template #action>
                  <Button variant="primary" @click="showEmpty = false">
                    <Icon icon="codicon:add" size="sm" />
                    Create Invoice
                  </Button>
                </template>
              </EmptyState>
            </div>

            <!-- ============ CLIENTS TAB ============ -->
            <div v-else-if="activeId === 'clients'" class="anchor-content">
              <div class="clients-grid">
                <Card v-for="biz in businesses" :key="biz.id" interactive @click="clientFilter = biz.id; activeTab = 'invoices'">
                  <div class="client-card">
                    <Icon icon="codicon:organization" size="lg" />
                    <div class="client-info">
                      <span class="client-name">{{ biz.name }}</span>
                      <span class="client-industry">{{ biz.industry }}</span>
                    </div>
                    <Badge variant="muted">
                      {{ invoices.filter(i => i.client === biz.id).length }} invoices
                    </Badge>
                  </div>
                </Card>
              </div>
            </div>
          </template>
        </Tabs>

        <!-- Status bar -->
        <StatusBar :items="statusBarItems" />

        <!-- Context Menu (table rows) -->
        <ContextMenu
          :open="ctxOpen"
          :x="ctxX"
          :y="ctxY"
          :items="rowActions"
          @update:open="ctxOpen = $event"
          @select="onCtxSelect"
        />

        <!-- Detail Modal -->
        <Modal :open="detailOpen" aria-label="Invoice Detail" @update:open="detailOpen = $event">
          <div v-if="detailInvoice" class="detail-modal">
            <div class="detail-header">
              <h2 class="detail-title">{{ detailInvoice.id }}</h2>
              <Badge :variant="statusConfig[detailInvoice.status].variant">
                {{ statusConfig[detailInvoice.status].label }}
              </Badge>
            </div>

            <div class="detail-meta">
              <div class="detail-field">
                <span class="detail-label">Client</span>
                <span class="detail-value">{{ detailInvoice.clientName }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Issued</span>
                <span class="detail-value">{{ formatDate(detailInvoice.issued) }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Due</span>
                <span class="detail-value">{{ formatDate(detailInvoice.due) }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Total</span>
                <span class="detail-value detail-total">{{ formatCurrency(detailInvoice.amount) }}</span>
              </div>
            </div>

            <h3 class="section-title">Line Items</h3>
            <table class="detail-line-items">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in detailInvoice.items" :key="idx">
                  <td>{{ item.description }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatCurrency(item.rate) }}</td>
                  <td>{{ formatCurrency(item.total) }}</td>
                </tr>
              </tbody>
            </table>

            <div class="detail-actions">
              <Button variant="primary" @click="detailOpen = false">Close</Button>
              <Button
                v-if="detailInvoice.status !== 'paid'"
                variant="ghost"
                @click="toast.add({ message: `${detailInvoice.id} marked as paid`, variant: 'success' }); detailOpen = false"
              >
                Mark as Paid
              </Button>
            </div>
          </div>
        </Modal>

        <!-- Toast container -->
        <Toast />
      </div>
    </Variant>

    <Variant title="Empty State">
      <div class="anchor-shell" data-theme="calcite">
        <header class="anchor-topbar">
          <div class="anchor-topbar-left">
            <Icon icon="codicon:symbol-misc" size="lg" label="Anchor" />
            <span class="anchor-brand">Anchor</span>
          </div>
        </header>
        <div class="anchor-content anchor-centered">
          <EmptyState
            title="Welcome to Anchor"
            description="Create your first invoice to start tracking revenue for your Briar Cove clients."
            icon="codicon:file-text"
          >
            <template #action>
              <Button variant="primary">
                <Icon icon="codicon:add" size="sm" />
                Create Invoice
              </Button>
            </template>
          </EmptyState>
        </div>
        <StatusBar :items="[]" />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell layout ---- */
.anchor-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #f8f5f1);
  color: var(--color-foreground, #1a1714);
  font-family: var(--font-sans, Inter, sans-serif);
}

/* ---- Topbar ---- */
.anchor-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border, #e0dbd5);
  background: var(--color-card, #eee9e3);
  gap: 16px;
}

.anchor-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.anchor-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 240px;
}

.anchor-brand {
  font-family: var(--font-mono, monospace);
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.02em;
}

/* ---- Tabs ---- */
.anchor-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: none;
  color: var(--color-muted-foreground, #6b6560);
  font-family: var(--font-sans, sans-serif);
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}

.anchor-tab[data-active] {
  color: var(--color-foreground, #1a1714);
  border-bottom-color: var(--color-primary, #a0714a);
}

.anchor-tab:hover {
  color: var(--color-foreground, #1a1714);
}

/* ---- Content area ---- */
.anchor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.anchor-centered {
  justify-content: center;
  align-items: center;
}

/* ---- Metric cards ---- */
.anchor-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
}

.metric-label {
  font-size: 12px;
  color: var(--color-muted-foreground, #6b6560);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-mono, monospace);
  color: var(--color-foreground, #1a1714);
}

.metric-danger {
  color: var(--color-destructive, #dc2626);
}

.metric-trend {
  font-size: 12px;
  color: var(--color-muted-foreground, #6b6560);
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-trend[data-positive] {
  color: var(--color-success, #16a34a);
}

.metric-count {
  font-size: 12px;
  color: var(--color-muted-foreground, #6b6560);
}

/* ---- Revenue chart ---- */
.revenue-chart {
  padding: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--color-foreground, #1a1714);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
}

.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}

.bar-fill {
  width: 100%;
  min-height: 4px;
  background: var(--color-primary, #a0714a);
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: 10px;
  color: var(--color-muted-foreground, #6b6560);
  font-family: var(--font-mono, monospace);
}

/* ---- Recent section ---- */
.recent-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
}

/* ---- Filter bar ---- */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-spacer {
  flex: 1;
}

.filter-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0 2px;
  font-size: 14px;
  line-height: 1;
  margin-left: 4px;
  opacity: 0.7;
}

.chip-remove:hover {
  opacity: 1;
}

/* ---- Clients grid ---- */
.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.client-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px;
}

.client-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.client-name {
  font-weight: 600;
  font-size: 14px;
}

.client-industry {
  font-size: 12px;
  color: var(--color-muted-foreground, #6b6560);
}

/* ---- Detail modal ---- */
.detail-modal {
  padding: 24px;
  min-width: 480px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  font-family: var(--font-mono, monospace);
  margin: 0;
}

.detail-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 11px;
  color: var(--color-muted-foreground, #6b6560);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
}

.detail-total {
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-mono, monospace);
}

.detail-line-items {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.detail-line-items th {
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground, #6b6560);
  padding: 6px 8px;
  border-bottom: 1px solid var(--color-border, #e0dbd5);
}

.detail-line-items td {
  padding: 6px 8px;
  border-bottom: 1px solid var(--color-border, #e0dbd5);
}

.detail-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
}
</style>
