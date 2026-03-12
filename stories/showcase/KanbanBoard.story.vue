<script setup lang="ts">
/**
 * Kanban Board — Drag-and-drop project management board
 * Theme: VSCode | Exercises: core, lists, menus, nav, layout, extras + useDragDrop
 *
 * Showcase #9 — Demonstrates column-based card management with drag-and-drop,
 * inline editing, WIP limits, filters, table toggle, and activity feed.
 */
import { ref, computed, reactive } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Badge from '@core/primitives/Badge.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Input from '@core/primitives/Input.vue'
import Select from '@core/primitives/Select.vue'
import Avatar from '@core/primitives/Avatar.vue'
import InlineEditor from '@core/primitives/InlineEditor.vue'
import Tabs from '@nav/Tabs.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import StatusBar from '@nav/StatusBar.vue'
import Table from '@lists/Table.vue'
import ContextMenu from '@menus/ContextMenu.vue'
import DropdownMenu from '@menus/DropdownMenu.vue'
import Modal from '@layout/Modal.vue'
import Toast from '@extras/Toast.vue'
import EmptyState from '@extras/EmptyState.vue'
import { toast } from '@extras/useToast'
import { provideDragDrop, type DropResult } from '@core/composables/useDragDrop'

// ---- Mock Data ----
import {
  board as initialBoard,
  activities,
  tableColumns,
  priorityConfig,
  tagColors,
  allTags,
  getAllCards,
  getCardStats,
  type Board,
  type KanbanCard,
  type Priority,
  type Activity,
} from './fixtures/kanban-data'
import { users } from './fixtures/briar-cove-users'

import type { Action, SortState } from '@core/types'

// ---------------------------------------------------------------------------
// Board state (deep clone to allow mutation)
// ---------------------------------------------------------------------------
const boardState = reactive<Board>(JSON.parse(JSON.stringify(initialBoard)))

// ---------------------------------------------------------------------------
// View mode
// ---------------------------------------------------------------------------
const viewMode = ref<'board' | 'table'>('board')

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
const activeTab = ref('board')
const tabItems = [
  { id: 'board', label: 'Board', icon: 'codicon:layout' },
  { id: 'activity', label: 'Activity', icon: 'codicon:pulse' },
]

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------
const breadcrumbs = computed(() => {
  const items = [{ id: 'projects', label: 'Projects' }, { id: 'anchor', label: 'Anchor' }]
  const tab = tabItems.find((t) => t.id === activeTab.value)
  if (tab) items.push({ id: tab.id, label: tab.label })
  return items
})

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
const searchQuery = ref('')
const priorityFilter = ref('')
const assigneeFilter = ref('')
const tagFilter = ref('')

const priorityOptions = [
  { id: '', label: 'All Priorities' },
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

const assigneeOptions = [
  { id: '', label: 'All Assignees' },
  ...users.map((u) => ({ id: u.id, label: u.name })),
]

const tagOptions = [
  { id: '', label: 'All Tags' },
  ...allTags.map((t) => ({ id: t, label: t })),
]

const hasActiveFilters = computed(
  () =>
    searchQuery.value !== '' ||
    priorityFilter.value !== '' ||
    assigneeFilter.value !== '' ||
    tagFilter.value !== '',
)

function clearFilters() {
  searchQuery.value = ''
  priorityFilter.value = ''
  assigneeFilter.value = ''
  tagFilter.value = ''
}

function cardMatchesFilters(card: KanbanCard): boolean {
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    if (!card.title.toLowerCase().includes(q) && !card.id.toLowerCase().includes(q)) return false
  }
  if (priorityFilter.value && card.priority !== priorityFilter.value) return false
  if (assigneeFilter.value && card.assignee?.id !== assigneeFilter.value) return false
  if (tagFilter.value && !card.tags.includes(tagFilter.value)) return false
  return true
}

// ---------------------------------------------------------------------------
// Filtered view of columns
// ---------------------------------------------------------------------------
const filteredColumns = computed(() =>
  boardState.columns.map((col) => ({
    ...col,
    cards: col.cards.filter(cardMatchesFilters),
  })),
)

// ---------------------------------------------------------------------------
// Table view
// ---------------------------------------------------------------------------
const tableSort = ref<SortState>({ column: 'id', direction: 'asc' })

const tableRows = computed(() => {
  const all = getAllCards(boardState).filter(cardMatchesFilters)
  const col = tableSort.value.column
  const dir = tableSort.value.direction === 'asc' ? 1 : -1
  return all.sort((a, b) => {
    const av = a[col as keyof typeof a]
    const bv = b[col as keyof typeof b]
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
    return String(av ?? '').localeCompare(String(bv ?? '')) * dir
  })
})

// ---------------------------------------------------------------------------
// Drag and drop
// ---------------------------------------------------------------------------
const {
  currentItem,
  dropTargetId,
  dragAttributes,
  dropZoneHandlers,
} = provideDragDrop({
  onDrop(result: DropResult) {
    const card = result.item.data as KanbanCard
    const sourceColId = result.item.sourceId
    const targetColId = result.targetId

    const sourceCol = boardState.columns.find((c) => c.id === sourceColId)
    const targetCol = boardState.columns.find((c) => c.id === targetColId)
    if (!sourceCol || !targetCol) return

    // Check WIP limit
    if (
      targetCol.limit !== null &&
      targetCol.cards.length >= targetCol.limit &&
      sourceColId !== targetColId
    ) {
      toast.add({
        message: `WIP limit reached for "${targetCol.title}" (max ${targetCol.limit})`,
        variant: 'warning',
      })
      return
    }

    // Remove from source
    const idx = sourceCol.cards.findIndex((c) => c.id === card.id)
    if (idx >= 0) sourceCol.cards.splice(idx, 1)

    // Insert into target
    const insertAt = Math.min(result.targetIndex, targetCol.cards.length)
    targetCol.cards.splice(insertAt, 0, card)

    if (sourceColId !== targetColId) {
      toast.add({
        message: `${card.id} moved to ${targetCol.title}`,
        variant: 'info',
      })
    }
  },
})

function getDropIndex(e: DragEvent): number {
  const target = e.currentTarget as HTMLElement
  const cards = target.querySelectorAll('[data-kanban-card]')
  const y = e.clientY
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i]!.getBoundingClientRect()
    if (y < rect.top + rect.height / 2) return i
  }
  return cards.length
}

// ---------------------------------------------------------------------------
// Context menu
// ---------------------------------------------------------------------------
const ctxOpen = ref(false)
const ctxX = ref(0)
const ctxY = ref(0)
const ctxCard = ref<KanbanCard | null>(null)

const ctxActions: Action[] = [
  { id: 'view', label: 'View Details', icon: 'codicon:eye' },
  { id: 'edit', label: 'Edit Title', icon: 'codicon:edit' },
  { id: 'assign', label: 'Assign to...', icon: 'codicon:person-add' },
  { id: 'priority', label: 'Change Priority', icon: 'codicon:arrow-swap' },
  { id: 'duplicate', label: 'Duplicate', icon: 'codicon:copy' },
  { id: 'archive', label: 'Archive', icon: 'codicon:archive' },
]

function onCardContext(card: KanbanCard, event: MouseEvent) {
  event.preventDefault()
  ctxCard.value = card
  ctxX.value = event.clientX
  ctxY.value = event.clientY
  ctxOpen.value = true
}

function onCtxSelect(action: Action) {
  ctxOpen.value = false
  if (!ctxCard.value) return
  const card = ctxCard.value

  switch (action.id) {
    case 'view':
      detailCard.value = card
      detailOpen.value = true
      break
    case 'edit':
      editingCardId.value = card.id
      break
    case 'assign':
      toast.add({ message: `Assign dialog for ${card.id}`, variant: 'info' })
      break
    case 'priority':
      toast.add({ message: `Priority picker for ${card.id}`, variant: 'info' })
      break
    case 'duplicate': {
      const col = boardState.columns.find((c) => c.cards.some((k) => k.id === card.id))
      if (col) {
        const dupe: KanbanCard = {
          ...card,
          id: `${card.id}-copy`,
          title: `${card.title} (copy)`,
          created: new Date().toISOString().slice(0, 10),
        }
        col.cards.push(dupe)
        toast.add({ message: `${card.id} duplicated`, variant: 'success' })
      }
      break
    }
    case 'archive': {
      for (const col of boardState.columns) {
        const idx = col.cards.findIndex((c) => c.id === card.id)
        if (idx >= 0) {
          col.cards.splice(idx, 1)
          toast.add({ message: `${card.id} archived`, variant: 'info' })
          break
        }
      }
      break
    }
  }
}

// ---------------------------------------------------------------------------
// Inline editing
// ---------------------------------------------------------------------------
const editingCardId = ref<string | null>(null)

function onTitleSubmit(card: KanbanCard, newTitle: string) {
  card.title = newTitle
  editingCardId.value = null
  toast.add({ message: `${card.id} title updated`, variant: 'success' })
}

// ---------------------------------------------------------------------------
// Detail modal
// ---------------------------------------------------------------------------
const detailOpen = ref(false)
const detailCard = ref<KanbanCard | null>(null)

function openDetail(card: KanbanCard) {
  detailCard.value = card
  detailOpen.value = true
}

// ---------------------------------------------------------------------------
// Column actions dropdown
// ---------------------------------------------------------------------------
const columnMenuOpen = ref<string | null>(null)

function columnActions(colId: string): Action[] {
  const col = boardState.columns.find((c) => c.id === colId)
  return [
    { id: 'collapse', label: col?.collapsed ? 'Expand' : 'Collapse', icon: col?.collapsed ? 'codicon:chevron-down' : 'codicon:chevron-up' },
    { id: 'sort-priority', label: 'Sort by Priority', icon: 'codicon:arrow-down' },
    { id: 'sort-date', label: 'Sort by Date', icon: 'codicon:calendar' },
    { id: 'clear-done', label: 'Clear All', icon: 'codicon:trash' },
  ]
}

function onColumnAction(colId: string, action: Action) {
  columnMenuOpen.value = null
  const col = boardState.columns.find((c) => c.id === colId)
  if (!col) return

  switch (action.id) {
    case 'collapse':
      col.collapsed = !col.collapsed
      break
    case 'sort-priority': {
      const order: Priority[] = ['critical', 'high', 'medium', 'low']
      col.cards.sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority))
      toast.add({ message: `${col.title} sorted by priority`, variant: 'info' })
      break
    }
    case 'sort-date':
      col.cards.sort((a, b) => a.created.localeCompare(b.created))
      toast.add({ message: `${col.title} sorted by date`, variant: 'info' })
      break
    case 'clear-done':
      col.cards.splice(0, col.cards.length)
      toast.add({ message: `${col.title} cleared`, variant: 'info' })
      break
  }
}

// ---------------------------------------------------------------------------
// New card
// ---------------------------------------------------------------------------
const newCardTitle = ref('')
const addingToColumn = ref<string | null>(null)

function startAddCard(colId: string) {
  addingToColumn.value = colId
  newCardTitle.value = ''
}

function submitNewCard(colId: string) {
  if (!newCardTitle.value.trim()) {
    addingToColumn.value = null
    return
  }
  const col = boardState.columns.find((c) => c.id === colId)
  if (!col) return

  const card: KanbanCard = {
    id: `ANC-${Date.now().toString(36).toUpperCase()}`,
    title: newCardTitle.value.trim(),
    description: '',
    priority: 'medium',
    assignee: null,
    tags: [],
    commentCount: 0,
    attachmentCount: 0,
    dueDate: null,
    created: new Date().toISOString().slice(0, 10),
    storyPoints: null,
  }

  col.cards.push(card)
  toast.add({ message: `${card.id} created in ${col.title}`, variant: 'success' })
  addingToColumn.value = null
  newCardTitle.value = ''
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------
const stats = computed(() => getCardStats(boardState))

// ---------------------------------------------------------------------------
// Activity helpers
// ---------------------------------------------------------------------------
function activityIcon(action: string): string {
  const map: Record<string, string> = {
    created: 'codicon:add',
    moved: 'codicon:arrow-right',
    commented: 'codicon:comment',
    assigned: 'codicon:person',
    tagged: 'codicon:tag',
    priority_changed: 'codicon:arrow-swap',
  }
  return map[action] ?? 'codicon:circle'
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function activityMessage(act: Activity): string {
  switch (act.action) {
    case 'created':
      return `created ${act.cardId}`
    case 'moved':
      return `moved ${act.cardId} from ${act.from} to ${act.to}`
    case 'commented':
      return `commented on ${act.cardId}`
    case 'assigned':
      return `assigned ${act.cardId} to ${act.to}`
    case 'tagged':
      return `tagged ${act.cardId} with ${act.to}`
    case 'priority_changed':
      return `changed ${act.cardId} priority from ${act.from} to ${act.to}`
    default:
      return `updated ${act.cardId}`
  }
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const statusBarItems = computed(() => [
  { id: 'total', content: `${stats.value.total} cards`, priority: 1, align: 'left' as const },
  { id: 'sprint', content: boardState.name, priority: 2, align: 'left' as const },
  {
    id: 'in-progress',
    content: `${stats.value.byColumn['in-progress'] ?? 0} in progress`,
    priority: 3,
    align: 'right' as const,
  },
  {
    id: 'done',
    content: `${stats.value.byColumn['done'] ?? 0} done`,
    priority: 4,
    align: 'right' as const,
  },
])
</script>

<template>
  <Story title="Kanban Board" icon="codicon:project" group="showcase">
    <!-- ================== VARIANT: DEFAULT ================== -->
    <Variant title="Default">
      <div class="kanban-shell" data-theme="vscode">
        <!-- Top bar -->
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:project" size="lg" label="Kanban" />
            <span class="kanban-brand">{{ boardState.name }}</span>
            <Breadcrumbs :items="breadcrumbs" />
          </div>
          <div class="kanban-topbar-right">
            <Input
              v-model="searchQuery"
              placeholder="Search cards..."
              clearable
              :debounce="200"
            >
              <template #leading>
                <Icon icon="codicon:search" size="sm" />
              </template>
            </Input>
            <div class="view-toggle">
              <IconButton
                :ariaLabel="'Board view'"
                :data-active="viewMode === 'board' || undefined"
                @click="viewMode = 'board'"
              >
                <Icon icon="codicon:layout" size="sm" />
              </IconButton>
              <IconButton
                :ariaLabel="'Table view'"
                :data-active="viewMode === 'table' || undefined"
                @click="viewMode = 'table'"
              >
                <Icon icon="codicon:list-flat" size="sm" />
              </IconButton>
            </div>
          </div>
        </header>

        <!-- Tab navigation -->
        <Tabs v-model="activeTab">
          <template #tabs="{ isActive, activate }">
            <button
              v-for="tab in tabItems"
              :key="tab.id"
              role="tab"
              :aria-selected="isActive(tab.id)"
              :data-active="isActive(tab.id) || undefined"
              class="kanban-tab"
              @click="activate(tab.id)"
            >
              <Icon :icon="tab.icon" size="sm" />
              {{ tab.label }}
            </button>
          </template>

          <template #default="{ activeId }">
            <!-- ============ BOARD TAB ============ -->
            <div v-if="activeId === 'board'" class="kanban-content">
              <!-- Filter bar -->
              <div class="filter-bar">
                <Select
                  v-model="priorityFilter"
                  :options="priorityOptions"
                  aria-label="Filter by priority"
                />
                <Select
                  v-model="assigneeFilter"
                  :options="assigneeOptions"
                  aria-label="Filter by assignee"
                />
                <Select
                  v-model="tagFilter"
                  :options="tagOptions"
                  aria-label="Filter by tag"
                />
                <Button
                  v-if="hasActiveFilters"
                  variant="ghost"
                  size="sm"
                  @click="clearFilters"
                >
                  <Icon icon="codicon:close" size="sm" />
                  Clear
                </Button>
              </div>

              <!-- Board view -->
              <div v-if="viewMode === 'board'" class="kanban-board">
                <div
                  v-for="col in filteredColumns"
                  :key="col.id"
                  class="kanban-column"
                  :data-over="dropTargetId === col.id || undefined"
                  :data-collapsed="col.collapsed || undefined"
                >
                  <!-- Column header -->
                  <div class="kanban-column-header">
                    <div class="kanban-column-title">
                      <span class="kanban-column-dot" :style="{ background: col.color }" />
                      <span class="kanban-column-name">{{ col.title }}</span>
                      <Badge variant="muted" size="sm">{{ col.cards.length }}</Badge>
                      <Badge
                        v-if="col.limit !== null"
                        :variant="col.cards.length >= col.limit ? 'warning' : 'muted'"
                        size="xs"
                      >
                        max {{ col.limit }}
                      </Badge>
                    </div>
                    <div class="kanban-column-actions">
                      <IconButton
                        ariaLabel="Add card"
                        @click="startAddCard(col.id)"
                      >
                        <Icon icon="codicon:add" size="sm" />
                      </IconButton>
                      <DropdownMenu
                        :open="columnMenuOpen === col.id"
                        :items="columnActions(col.id)"
                        @update:open="columnMenuOpen = $event ? col.id : null"
                        @select="onColumnAction(col.id, $event)"
                      >
                        <template #trigger>
                          <IconButton
                            ariaLabel="Column options"
                            @click="columnMenuOpen = columnMenuOpen === col.id ? null : col.id"
                          >
                            <Icon icon="codicon:ellipsis" size="sm" />
                          </IconButton>
                        </template>
                      </DropdownMenu>
                    </div>
                  </div>

                  <!-- Card list (drop zone) -->
                  <div
                    v-if="!col.collapsed"
                    class="kanban-card-list"
                    v-bind="dropZoneHandlers(col.id, getDropIndex)"
                  >
                    <!-- Cards -->
                    <div
                      v-for="(card, cardIdx) in col.cards"
                      :key="card.id"
                      class="kanban-card-wrapper"
                      data-kanban-card
                      v-bind="dragAttributes(col.id, cardIdx, card)"
                      :data-dragging="currentItem?.data === card || undefined"
                      @contextmenu="onCardContext(card, $event)"
                    >
                      <Card @click="openDetail(card)">
                        <div class="kanban-card-inner">
                          <!-- Card header -->
                          <div class="kanban-card-top">
                            <span class="kanban-card-id">{{ card.id }}</span>
                            <Badge
                              :variant="priorityConfig[card.priority].variant"
                              size="xs"
                            >
                              <Icon
                                :icon="priorityConfig[card.priority].icon"
                                size="xs"
                              />
                              {{ priorityConfig[card.priority].label }}
                            </Badge>
                          </div>

                          <!-- Card title (inline editable) -->
                          <InlineEditor
                            :model-value="card.title"
                            :editing="editingCardId === card.id"
                            @update:editing="editingCardId = $event ? card.id : null"
                            @submit="onTitleSubmit(card, $event)"
                            @click.stop
                          />

                          <!-- Tags -->
                          <div v-if="card.tags.length" class="kanban-card-tags">
                            <span
                              v-for="tag in card.tags"
                              :key="tag"
                              class="kanban-tag"
                              :style="{ '--tag-color': tagColors[tag] }"
                            >
                              {{ tag }}
                            </span>
                          </div>

                          <!-- Card footer -->
                          <div class="kanban-card-footer">
                            <div class="kanban-card-meta">
                              <span v-if="card.storyPoints !== null" class="kanban-points">
                                {{ card.storyPoints }}pt
                              </span>
                              <span v-if="card.commentCount" class="kanban-meta-item">
                                <Icon icon="codicon:comment" size="xs" />
                                {{ card.commentCount }}
                              </span>
                              <span v-if="card.attachmentCount" class="kanban-meta-item">
                                <Icon icon="codicon:file" size="xs" />
                                {{ card.attachmentCount }}
                              </span>
                              <span v-if="card.dueDate" class="kanban-meta-item kanban-due">
                                <Icon icon="codicon:calendar" size="xs" />
                                {{ formatDate(card.dueDate) }}
                              </span>
                            </div>
                            <Avatar
                              v-if="card.assignee"
                              :name="card.assignee.name"
                              :color="card.assignee.color"
                              size="xs"
                            />
                          </div>
                        </div>
                      </Card>
                    </div>

                    <!-- Add card form -->
                    <div v-if="addingToColumn === col.id" class="kanban-add-form">
                      <Input
                        v-model="newCardTitle"
                        placeholder="Card title..."
                        @enter="submitNewCard(col.id)"
                        @blur="submitNewCard(col.id)"
                      />
                      <div class="kanban-add-actions">
                        <Button variant="primary" size="sm" @click="submitNewCard(col.id)">
                          Add
                        </Button>
                        <Button variant="ghost" size="sm" @click="addingToColumn = null">
                          Cancel
                        </Button>
                      </div>
                    </div>

                    <!-- Empty column -->
                    <div v-if="col.cards.length === 0 && addingToColumn !== col.id" class="kanban-empty-col">
                      <span class="kanban-empty-text">No cards</span>
                    </div>
                  </div>

                  <!-- Collapsed state -->
                  <div
                    v-else
                    class="kanban-collapsed-body"
                    @click="boardState.columns.find(c => c.id === col.id)!.collapsed = false"
                  >
                    <span class="kanban-collapsed-count">{{ col.cards.length }}</span>
                  </div>
                </div>
              </div>

              <!-- Table view -->
              <div v-else class="kanban-table-view">
                <Table
                  :columns="tableColumns"
                  :rows="(tableRows as unknown as Record<string, unknown>[])"
                  :sort="tableSort"
                  row-key="id"
                  @update:sort="tableSort = $event"
                  @row-click="openDetail($event as unknown as KanbanCard)"
                >
                  <template #cell-priority="{ value }">
                    <Badge
                      :variant="priorityConfig[value as Priority].variant"
                      size="sm"
                    >
                      {{ priorityConfig[value as Priority].label }}
                    </Badge>
                  </template>
                  <template #cell-assignee="{ row }">
                    <div v-if="(row as unknown as KanbanCard).assignee" class="kanban-table-assignee">
                      <Avatar
                        :name="(row as unknown as KanbanCard).assignee!.name"
                        :color="(row as unknown as KanbanCard).assignee!.color"
                        size="xs"
                      />
                      <span>{{ (row as unknown as KanbanCard).assignee!.name }}</span>
                    </div>
                    <span v-else class="kanban-unassigned">Unassigned</span>
                  </template>
                  <template #cell-tags="{ row }">
                    <div class="kanban-card-tags">
                      <span
                        v-for="tag in (row as unknown as KanbanCard).tags"
                        :key="tag"
                        class="kanban-tag"
                        :style="{ '--tag-color': tagColors[tag] }"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </template>
                </Table>
              </div>
            </div>

            <!-- ============ ACTIVITY TAB ============ -->
            <div v-else-if="activeId === 'activity'" class="kanban-content kanban-activity">
              <h3 class="section-title">Recent Activity</h3>
              <div class="activity-feed">
                <div
                  v-for="act in activities"
                  :key="act.id"
                  class="activity-item"
                >
                  <Avatar :name="act.user.name" :color="act.user.color" size="sm" />
                  <div class="activity-body">
                    <div class="activity-line">
                      <strong>{{ act.user.name }}</strong>
                      <span>{{ activityMessage(act) }}</span>
                    </div>
                    <div v-if="act.detail" class="activity-detail">
                      {{ act.detail }}
                    </div>
                    <span class="activity-time">{{ formatTimestamp(act.timestamp) }}</span>
                  </div>
                  <Icon :icon="activityIcon(act.action)" size="sm" class="activity-icon" />
                </div>
              </div>
            </div>
          </template>
        </Tabs>

        <!-- Status bar -->
        <StatusBar :items="statusBarItems" />

        <!-- Context Menu -->
        <ContextMenu
          :open="ctxOpen"
          :x="ctxX"
          :y="ctxY"
          :items="ctxActions"
          @update:open="ctxOpen = $event"
          @select="onCtxSelect"
        />

        <!-- Detail Modal -->
        <Modal :open="detailOpen" aria-label="Card Detail" @update:open="detailOpen = $event">
          <div v-if="detailCard" class="detail-modal">
            <div class="detail-header">
              <div class="detail-header-left">
                <span class="detail-card-id">{{ detailCard.id }}</span>
                <Badge
                  :variant="priorityConfig[detailCard.priority].variant"
                >
                  <Icon :icon="priorityConfig[detailCard.priority].icon" size="xs" />
                  {{ priorityConfig[detailCard.priority].label }}
                </Badge>
              </div>
              <IconButton ariaLabel="Close" @click="detailOpen = false">
                <Icon icon="codicon:close" size="sm" />
              </IconButton>
            </div>

            <h2 class="detail-title">{{ detailCard.title }}</h2>
            <p class="detail-description">{{ detailCard.description }}</p>

            <div class="detail-meta">
              <div class="detail-field">
                <span class="detail-label">Assignee</span>
                <div v-if="detailCard.assignee" class="detail-assignee">
                  <Avatar
                    :name="detailCard.assignee.name"
                    :color="detailCard.assignee.color"
                    size="sm"
                  />
                  <span>{{ detailCard.assignee.name }}</span>
                </div>
                <span v-else class="kanban-unassigned">Unassigned</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Due Date</span>
                <span>{{ formatDate(detailCard.dueDate) }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Story Points</span>
                <span>{{ detailCard.storyPoints ?? '—' }}</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Created</span>
                <span>{{ formatDate(detailCard.created) }}</span>
              </div>
            </div>

            <div class="detail-field">
              <span class="detail-label">Tags</span>
              <div class="kanban-card-tags">
                <span
                  v-for="tag in detailCard.tags"
                  :key="tag"
                  class="kanban-tag"
                  :style="{ '--tag-color': tagColors[tag] }"
                >
                  {{ tag }}
                </span>
                <span v-if="!detailCard.tags.length" class="kanban-unassigned">No tags</span>
              </div>
            </div>

            <div class="detail-stats">
              <span class="kanban-meta-item">
                <Icon icon="codicon:comment" size="sm" />
                {{ detailCard.commentCount }} comments
              </span>
              <span class="kanban-meta-item">
                <Icon icon="codicon:file" size="sm" />
                {{ detailCard.attachmentCount }} attachments
              </span>
            </div>

            <div class="detail-actions">
              <Button variant="primary" @click="detailOpen = false">Close</Button>
            </div>
          </div>
        </Modal>

        <!-- Toast container -->
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: TABLE VIEW ================== -->
    <Variant title="Table View">
      <div class="kanban-shell" data-theme="vscode">
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:project" size="lg" label="Kanban" />
            <span class="kanban-brand">{{ boardState.name }}</span>
          </div>
        </header>
        <div class="kanban-content">
          <Table
            :columns="tableColumns"
            :rows="(tableRows as unknown as Record<string, unknown>[])"
            :sort="tableSort"
            row-key="id"
            @update:sort="tableSort = $event"
          >
            <template #cell-priority="{ value }">
              <Badge
                :variant="priorityConfig[value as Priority].variant"
                size="sm"
              >
                {{ priorityConfig[value as Priority].label }}
              </Badge>
            </template>
            <template #cell-assignee="{ row }">
              <div v-if="(row as unknown as KanbanCard).assignee" class="kanban-table-assignee">
                <Avatar
                  :name="(row as unknown as KanbanCard).assignee!.name"
                  :color="(row as unknown as KanbanCard).assignee!.color"
                  size="xs"
                />
                <span>{{ (row as unknown as KanbanCard).assignee!.name }}</span>
              </div>
              <span v-else class="kanban-unassigned">Unassigned</span>
            </template>
            <template #cell-tags="{ row }">
              <div class="kanban-card-tags">
                <span
                  v-for="tag in (row as unknown as KanbanCard).tags"
                  :key="tag"
                  class="kanban-tag"
                  :style="{ '--tag-color': tagColors[tag] }"
                >
                  {{ tag }}
                </span>
              </div>
            </template>
          </Table>
        </div>
        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: ACTIVITY FEED ================== -->
    <Variant title="Activity Feed">
      <div class="kanban-shell" data-theme="vscode">
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:pulse" size="lg" label="Activity" />
            <span class="kanban-brand">Sprint Activity</span>
          </div>
        </header>
        <div class="kanban-content kanban-activity">
          <h3 class="section-title">Recent Activity</h3>
          <div class="activity-feed">
            <div
              v-for="act in activities"
              :key="act.id"
              class="activity-item"
            >
              <Avatar :name="act.user.name" :color="act.user.color" size="sm" />
              <div class="activity-body">
                <div class="activity-line">
                  <strong>{{ act.user.name }}</strong>
                  <span>{{ activityMessage(act) }}</span>
                </div>
                <div v-if="act.detail" class="activity-detail">
                  {{ act.detail }}
                </div>
                <span class="activity-time">{{ formatTimestamp(act.timestamp) }}</span>
              </div>
              <Icon :icon="activityIcon(act.action)" size="sm" class="activity-icon" />
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: WIP LIMITS ================== -->
    <Variant title="WIP Limits">
      <div class="kanban-shell" data-theme="vscode">
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:project" size="lg" label="Kanban" />
            <span class="kanban-brand">WIP Limits Demo</span>
          </div>
        </header>
        <div class="kanban-content">
          <p class="kanban-tip">
            <Icon icon="codicon:info" size="sm" />
            The "In Progress" column has a WIP limit of 4. Try dragging a card into it — if it's at capacity, a warning toast appears.
          </p>
          <div class="kanban-board">
            <div
              v-for="col in filteredColumns"
              :key="col.id"
              class="kanban-column"
              :data-over="dropTargetId === col.id || undefined"
            >
              <div class="kanban-column-header">
                <div class="kanban-column-title">
                  <span class="kanban-column-dot" :style="{ background: col.color }" />
                  <span class="kanban-column-name">{{ col.title }}</span>
                  <Badge variant="muted" size="sm">{{ col.cards.length }}</Badge>
                  <Badge
                    v-if="col.limit !== null"
                    :variant="col.cards.length >= col.limit ? 'warning' : 'muted'"
                    size="xs"
                  >
                    max {{ col.limit }}
                  </Badge>
                </div>
              </div>
              <div
                class="kanban-card-list"
                v-bind="dropZoneHandlers(col.id, getDropIndex)"
              >
                <div
                  v-for="(card, cardIdx) in col.cards"
                  :key="card.id"
                  class="kanban-card-wrapper"
                  data-kanban-card
                  v-bind="dragAttributes(col.id, cardIdx, card)"
                  :data-dragging="currentItem?.data === card || undefined"
                >
                  <Card>
                    <div class="kanban-card-inner kanban-card-compact">
                      <span class="kanban-card-id">{{ card.id }}</span>
                      <span>{{ card.title }}</span>
                    </div>
                  </Card>
                </div>
                <div v-if="col.cards.length === 0" class="kanban-empty-col">
                  <span class="kanban-empty-text">Drop cards here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: EMPTY STATE ================== -->
    <Variant title="Empty Board">
      <div class="kanban-shell" data-theme="vscode">
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:project" size="lg" label="Kanban" />
            <span class="kanban-brand">New Project</span>
          </div>
        </header>
        <div class="kanban-content kanban-centered">
          <EmptyState
            title="No cards yet"
            description="Create your first card to start organizing work on this board."
            icon="codicon:project"
          >
            <template #action>
              <Button variant="primary">
                <Icon icon="codicon:add" size="sm" />
                Create Card
              </Button>
            </template>
          </EmptyState>
        </div>
        <StatusBar :items="[]" />
      </div>
    </Variant>

    <!-- ================== VARIANT: FILTERED ================== -->
    <Variant title="Filtered View">
      <div class="kanban-shell" data-theme="vscode">
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:project" size="lg" label="Kanban" />
            <span class="kanban-brand">{{ boardState.name }}</span>
          </div>
          <div class="kanban-topbar-right">
            <Input
              v-model="searchQuery"
              placeholder="Search cards..."
              clearable
              :debounce="200"
            >
              <template #leading>
                <Icon icon="codicon:search" size="sm" />
              </template>
            </Input>
          </div>
        </header>
        <div class="kanban-content">
          <div class="filter-bar">
            <Select
              v-model="priorityFilter"
              :options="priorityOptions"
              aria-label="Filter by priority"
            />
            <Select
              v-model="assigneeFilter"
              :options="assigneeOptions"
              aria-label="Filter by assignee"
            />
            <Select
              v-model="tagFilter"
              :options="tagOptions"
              aria-label="Filter by tag"
            />
            <Button
              v-if="hasActiveFilters"
              variant="ghost"
              size="sm"
              @click="clearFilters"
            >
              <Icon icon="codicon:close" size="sm" />
              Clear
            </Button>
          </div>
          <div class="kanban-board">
            <div
              v-for="col in filteredColumns"
              :key="col.id"
              class="kanban-column"
            >
              <div class="kanban-column-header">
                <div class="kanban-column-title">
                  <span class="kanban-column-dot" :style="{ background: col.color }" />
                  <span class="kanban-column-name">{{ col.title }}</span>
                  <Badge variant="muted" size="sm">{{ col.cards.length }}</Badge>
                </div>
              </div>
              <div class="kanban-card-list">
                <div
                  v-for="card in col.cards"
                  :key="card.id"
                  class="kanban-card-wrapper"
                  data-kanban-card
                >
                  <Card @click="openDetail(card)">
                    <div class="kanban-card-inner">
                      <div class="kanban-card-top">
                        <span class="kanban-card-id">{{ card.id }}</span>
                        <Badge
                          :variant="priorityConfig[card.priority].variant"
                          size="xs"
                        >
                          {{ priorityConfig[card.priority].label }}
                        </Badge>
                      </div>
                      <span>{{ card.title }}</span>
                      <div v-if="card.tags.length" class="kanban-card-tags">
                        <span
                          v-for="tag in card.tags"
                          :key="tag"
                          class="kanban-tag"
                          :style="{ '--tag-color': tagColors[tag] }"
                        >
                          {{ tag }}
                        </span>
                      </div>
                      <div class="kanban-card-footer">
                        <div class="kanban-card-meta">
                          <span v-if="card.storyPoints !== null" class="kanban-points">
                            {{ card.storyPoints }}pt
                          </span>
                        </div>
                        <Avatar
                          v-if="card.assignee"
                          :name="card.assignee.name"
                          :color="card.assignee.color"
                          size="xs"
                        />
                      </div>
                    </div>
                  </Card>
                </div>
                <div v-if="col.cards.length === 0" class="kanban-empty-col">
                  <span class="kanban-empty-text">No matching cards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
        <Modal :open="detailOpen" aria-label="Card Detail" @update:open="detailOpen = $event">
          <div v-if="detailCard" class="detail-modal">
            <div class="detail-header">
              <div class="detail-header-left">
                <span class="detail-card-id">{{ detailCard.id }}</span>
                <Badge :variant="priorityConfig[detailCard.priority].variant">
                  {{ priorityConfig[detailCard.priority].label }}
                </Badge>
              </div>
              <IconButton ariaLabel="Close" @click="detailOpen = false">
                <Icon icon="codicon:close" size="sm" />
              </IconButton>
            </div>
            <h2 class="detail-title">{{ detailCard.title }}</h2>
            <p class="detail-description">{{ detailCard.description }}</p>
            <div class="detail-actions">
              <Button variant="primary" @click="detailOpen = false">Close</Button>
            </div>
          </div>
        </Modal>
        <Toast />
      </div>
    </Variant>

    <!-- ================== VARIANT: CARD DETAIL ================== -->
    <Variant title="Card Detail Modal">
      <div class="kanban-shell" data-theme="vscode">
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:project" size="lg" label="Kanban" />
            <span class="kanban-brand">Card Detail Preview</span>
          </div>
        </header>
        <div class="kanban-content kanban-centered">
          <div class="detail-modal detail-modal-inline">
            <div class="detail-header">
              <div class="detail-header-left">
                <span class="detail-card-id">ANC-114</span>
                <Badge variant="error">
                  <Icon icon="codicon:flame" size="xs" />
                  Critical
                </Badge>
              </div>
            </div>

            <h2 class="detail-title">Stripe webhook integration</h2>
            <p class="detail-description">
              Listen for payment events from Stripe. Auto-update invoice status on payment receipt.
            </p>

            <div class="detail-meta">
              <div class="detail-field">
                <span class="detail-label">Assignee</span>
                <div class="detail-assignee">
                  <Avatar name="Jasper Cole" color="#059669" size="sm" />
                  <span>Jasper Cole</span>
                </div>
              </div>
              <div class="detail-field">
                <span class="detail-label">Due Date</span>
                <span>Mar 12</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Story Points</span>
                <span>8</span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Created</span>
                <span>Feb 25</span>
              </div>
            </div>

            <div class="detail-field">
              <span class="detail-label">Tags</span>
              <div class="kanban-card-tags">
                <span class="kanban-tag" :style="{ '--tag-color': '#3b82f6' }">backend</span>
                <span class="kanban-tag" :style="{ '--tag-color': '#f59e0b' }">billing</span>
                <span class="kanban-tag" :style="{ '--tag-color': '#6b7280' }">infrastructure</span>
              </div>
            </div>

            <div class="detail-stats">
              <span class="kanban-meta-item">
                <Icon icon="codicon:comment" size="sm" />
                15 comments
              </span>
              <span class="kanban-meta-item">
                <Icon icon="codicon:file" size="sm" />
                1 attachment
              </span>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
      </div>
    </Variant>

    <!-- ================== VARIANT: COLLAPSED COLUMNS ================== -->
    <Variant title="Collapsed Columns">
      <div class="kanban-shell" data-theme="vscode">
        <header class="kanban-topbar">
          <div class="kanban-topbar-left">
            <Icon icon="codicon:project" size="lg" label="Kanban" />
            <span class="kanban-brand">{{ boardState.name }}</span>
          </div>
        </header>
        <div class="kanban-content">
          <p class="kanban-tip">
            <Icon icon="codicon:info" size="sm" />
            Use the column menu to collapse/expand columns. Click a collapsed column to expand it.
          </p>
          <div class="kanban-board">
            <div
              v-for="col in boardState.columns"
              :key="col.id"
              class="kanban-column"
              :data-collapsed="col.collapsed || undefined"
            >
              <div class="kanban-column-header">
                <div class="kanban-column-title">
                  <span class="kanban-column-dot" :style="{ background: col.color }" />
                  <span class="kanban-column-name">{{ col.title }}</span>
                  <Badge variant="muted" size="sm">{{ col.cards.length }}</Badge>
                </div>
                <div class="kanban-column-actions">
                  <DropdownMenu
                    :open="columnMenuOpen === col.id"
                    :items="columnActions(col.id)"
                    @update:open="columnMenuOpen = $event ? col.id : null"
                    @select="onColumnAction(col.id, $event)"
                  >
                    <template #trigger>
                      <IconButton
                        ariaLabel="Column options"
                        @click="columnMenuOpen = columnMenuOpen === col.id ? null : col.id"
                      >
                        <Icon icon="codicon:ellipsis" size="sm" />
                      </IconButton>
                    </template>
                  </DropdownMenu>
                </div>
              </div>
              <div v-if="!col.collapsed" class="kanban-card-list">
                <div
                  v-for="card in col.cards"
                  :key="card.id"
                  class="kanban-card-wrapper"
                  data-kanban-card
                >
                  <Card>
                    <div class="kanban-card-inner kanban-card-compact">
                      <span class="kanban-card-id">{{ card.id }}</span>
                      <span>{{ card.title }}</span>
                    </div>
                  </Card>
                </div>
              </div>
              <div
                v-else
                class="kanban-collapsed-body"
                @click="col.collapsed = false"
              >
                <span class="kanban-collapsed-count">{{ col.cards.length }}</span>
              </div>
            </div>
          </div>
        </div>
        <StatusBar :items="statusBarItems" />
        <Toast />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.kanban-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 700px;
  background: var(--color-background, #1e1e1e);
  color: var(--color-foreground, #d4d4d4);
  font-family: var(--font-sans, 'Segoe UI', sans-serif);
}

/* ---- Topbar ---- */
.kanban-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border, #3c3c3c);
  background: var(--color-card, #252526);
  gap: 16px;
}

.kanban-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.kanban-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 240px;
}

.kanban-brand {
  font-family: var(--font-mono, 'Cascadia Code', monospace);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.02em;
}

/* ---- Tabs ---- */
.kanban-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  background: none;
  color: var(--color-muted-foreground, #858585);
  font-family: var(--font-sans, sans-serif);
  font-size: 13px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}

.kanban-tab[data-active] {
  color: var(--color-foreground, #d4d4d4);
  border-bottom-color: var(--color-primary, #007acc);
}

.kanban-tab:hover {
  color: var(--color-foreground, #d4d4d4);
}

/* ---- Content area ---- */
.kanban-content {
  flex: 1;
  overflow: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kanban-centered {
  justify-content: center;
  align-items: center;
}

/* ---- View toggle ---- */
.view-toggle {
  display: flex;
  gap: 2px;
  border: 1px solid var(--color-border, #3c3c3c);
  border-radius: 4px;
  padding: 2px;
}

.view-toggle [data-active] {
  background: var(--color-primary, #007acc);
  color: #fff;
  border-radius: 2px;
}

/* ---- Filter bar ---- */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* ---- Board layout ---- */
.kanban-board {
  display: flex;
  gap: 12px;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 8px;
  align-items: flex-start;
}

/* ---- Column ---- */
.kanban-column {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 320px;
  flex: 1;
  background: var(--color-card, #252526);
  border-radius: 6px;
  border: 1px solid var(--color-border, #3c3c3c);
  transition: border-color 0.15s;
}

.kanban-column[data-over] {
  border-color: var(--color-primary, #007acc);
  box-shadow: 0 0 0 1px var(--color-primary, #007acc);
}

.kanban-column[data-collapsed] {
  min-width: 48px;
  max-width: 48px;
  align-items: center;
}

.kanban-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border, #3c3c3c);
}

.kanban-column[data-collapsed] .kanban-column-header {
  flex-direction: column;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 12px 4px;
  border-bottom: none;
}

.kanban-column-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.kanban-column-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.kanban-column-name {
  white-space: nowrap;
}

.kanban-column-actions {
  display: flex;
  gap: 2px;
}

/* ---- Card list (drop zone) ---- */
.kanban-card-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  min-height: 60px;
  flex: 1;
}

/* ---- Card wrapper ---- */
.kanban-card-wrapper {
  cursor: grab;
  transition: opacity 0.15s, transform 0.1s;
}

.kanban-card-wrapper[data-dragging] {
  opacity: 0.4;
  transform: scale(0.98);
}

.kanban-card-wrapper:active {
  cursor: grabbing;
}

.kanban-card-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px;
}

.kanban-card-compact {
  gap: 4px;
  font-size: 13px;
}

/* ---- Card elements ---- */
.kanban-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kanban-card-id {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-muted-foreground, #858585);
}

.kanban-card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.kanban-tag {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  font-size: 10px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--tag-color, #6b7280) 20%, transparent);
  color: var(--tag-color, #6b7280);
  border: 1px solid color-mix(in srgb, var(--tag-color, #6b7280) 40%, transparent);
}

.kanban-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kanban-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--color-muted-foreground, #858585);
}

.kanban-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.kanban-points {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary, #007acc);
}

.kanban-due {
  color: var(--color-warning, #cca700);
}

.kanban-unassigned {
  font-size: 12px;
  color: var(--color-muted-foreground, #858585);
  font-style: italic;
}

/* ---- Add card form ---- */
.kanban-add-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kanban-add-actions {
  display: flex;
  gap: 4px;
}

/* ---- Empty column ---- */
.kanban-empty-col {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  border: 1px dashed var(--color-border, #3c3c3c);
  border-radius: 4px;
}

.kanban-empty-text {
  font-size: 12px;
  color: var(--color-muted-foreground, #858585);
}

/* ---- Collapsed column ---- */
.kanban-collapsed-body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
}

.kanban-collapsed-count {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted-foreground, #858585);
}

/* ---- Table view ---- */
.kanban-table-view {
  flex: 1;
  overflow: auto;
}

.kanban-table-assignee {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ---- Activity feed ---- */
.kanban-activity {
  max-width: 700px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--color-foreground, #d4d4d4);
}

.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 4px;
  transition: background 0.1s;
}

.activity-item:hover {
  background: color-mix(in srgb, var(--color-foreground, #d4d4d4) 5%, transparent);
}

.activity-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.activity-line {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.activity-detail {
  font-size: 12px;
  color: var(--color-muted-foreground, #858585);
  padding: 6px 10px;
  background: color-mix(in srgb, var(--color-foreground, #d4d4d4) 3%, transparent);
  border-radius: 4px;
  margin-top: 4px;
  border-left: 2px solid var(--color-border, #3c3c3c);
}

.activity-time {
  font-size: 11px;
  color: var(--color-muted-foreground, #858585);
}

.activity-icon {
  color: var(--color-muted-foreground, #858585);
  flex-shrink: 0;
  margin-top: 2px;
}

/* ---- Tip ---- */
.kanban-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-muted-foreground, #858585);
  background: color-mix(in srgb, var(--color-primary, #007acc) 10%, transparent);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid color-mix(in srgb, var(--color-primary, #007acc) 30%, transparent);
  margin: 0;
}

/* ---- Detail modal ---- */
.detail-modal {
  padding: 24px;
  min-width: 480px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--color-card, #252526);
  color: var(--color-foreground, #d4d4d4);
  border-radius: 8px;
}

.detail-modal-inline {
  border: 1px solid var(--color-border, #3c3c3c);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-card-id {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted-foreground, #858585);
}

.detail-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.detail-description {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-muted-foreground, #858585);
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
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: var(--color-muted-foreground, #858585);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-assignee {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.detail-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 8px;
}
</style>
