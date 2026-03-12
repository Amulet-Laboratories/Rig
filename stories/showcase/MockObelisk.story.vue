<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// ---- Rig Components ----
import ShellGrid from '@layout/ShellGrid.vue'
import ActivityBar from '@nav/ActivityBar.vue'
import SideBar from '@nav/SideBar.vue'
import StatusBar from '@nav/StatusBar.vue'
import PanelBar from '@nav/PanelBar.vue'
import View from '@nav/View.vue'
import Breadcrumbs from '@nav/Breadcrumbs.vue'
import EditorWorkbench from '@editor/EditorWorkbench.vue'
import TreeView from '@lists/TreeView.vue'
import List from '@lists/List.vue'
import Menubar from '@menus/Menubar.vue'
import CommandPalette from '@menus/CommandPalette.vue'
import ContextMenu from '@menus/ContextMenu.vue'
import Icon from '@core/primitives/Icon.vue'
import Select from '@core/primitives/Select.vue'
import EmptyState from '@extras/EmptyState.vue'
import NotificationCenter from '@extras/NotificationCenter.vue'
import Toast from '@extras/Toast.vue'
import Tooltip from '@extras/Tooltip.vue'
import Panel from '@layout/Panel.vue'

// ---- Showcase sub-components ----
import ChatPanel from './components/ChatPanel.vue'
import RecordViewer from './components/RecordViewer.vue'

// ---- Fixtures ----
import {
  menubarItems,
  commandPaletteItems,
  recordCtxItems,
  registryCtxItems,
  tabCtxItems,
} from './fixtures/obelisk-menus'
import {
  domains,
  activityItems,
  mockRecords,
  buildRegistryTree,
  buildStatusBarItems,
  panelTabs,
  activityLogItems,
  defaultEditorTabs,
  chatModes,
  chatModels,
  chatContexts,
} from './fixtures/obelisk-data'
import type { VaultRecord } from './fixtures/obelisk-data'
import { records } from './fixtures/obelisk-records'

// ---- Types ----
import type { Action, TabItem, TreeNode, ListItem, ID, SelectOption } from '@core/types'

// ---------------------------------------------------------------------------
// Domain
// ---------------------------------------------------------------------------
const activeDomain = ref('legal')
const domainMeta = computed(() => domains.find((d) => d.id === activeDomain.value))

const domainOptions = computed<SelectOption[]>(() => [
  ...domains.map((d) => ({ id: d.id, label: d.label })),
])

function onDomainChange(value: string) {
  activeDomain.value = value
  // Reset sidebar state on domain change
  expandedNodes.value = []
  // Close tabs from other domains
  editorTabs.value = editorTabs.value.filter((t) => {
    const rec = mockRecords.find((r) => r.id === t.id)
    return rec && rec.domain === value
  })
  if (!editorTabs.value.find((t) => t.id === activeTabId.value)) {
    activeTabId.value = editorTabs.value[0]?.id as string ?? ''
  }
}

// ---------------------------------------------------------------------------
// Activity Bar
// ---------------------------------------------------------------------------
const activeActivityId = ref<string>('explorer')
let previousActivityId = 'explorer'

function onActivitySelect(action: Action) {
  if (action.id === previousActivityId && sidebarOpen.value) {
    sidebarOpen.value = false
  } else {
    sidebarOpen.value = true
    activeActivityId.value = action.id as string
  }
  previousActivityId = action.id as string
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
const sidebarOpen = ref(true)
const shellSizes = ref({ sideWidth: 260, panelHeight: 200 })

const expandedNodes = ref<ID[]>([])
const registryTree = computed(() => buildRegistryTree(activeDomain.value))

// Auto-expand registries with records
watch(activeDomain, () => {
  expandedNodes.value = registryTree.value.map((n) => n.id)
}, { immediate: true })

// ---------------------------------------------------------------------------
// Editor Tabs & Content
// ---------------------------------------------------------------------------
const editorTabs = ref<TabItem[]>([...defaultEditorTabs])
const activeTabId = ref<string>('legal:cases:custody-dispute')

const activeRecord = computed(() => {
  return records[activeTabId.value] ?? null
})

function openRecord(record: VaultRecord) {
  if (!editorTabs.value.find((t) => t.id === record.id)) {
    editorTabs.value.push({
      id: record.id,
      label: record.name,
      icon: 'codicon:file',
      closable: true,
    })
  }
  activeTabId.value = record.id
}

function closeTab(id: string | ID) {
  const tabId = String(id)
  const idx = editorTabs.value.findIndex((t) => t.id === tabId)
  if (idx < 0) return
  editorTabs.value.splice(idx, 1)
  if (activeTabId.value === tabId) {
    activeTabId.value = (editorTabs.value[Math.min(idx, editorTabs.value.length - 1)]?.id as string) ?? ''
  }
}

// Breadcrumbs
const breadcrumbs = computed(() => {
  const rec = activeRecord.value
  if (!rec) return []
  const meta = domains.find((d) => d.id === rec.domain)
  return [
    { id: 'domain', label: meta?.label ?? rec.domain },
    { id: 'registry', label: rec.registry },
    { id: 'name', label: rec.name },
  ]
})

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------
const panelVisible = ref(false)
const activePanelId = ref('activity')

// ---------------------------------------------------------------------------
// Command Palette
// ---------------------------------------------------------------------------
const commandPaletteOpen = ref(false)

function onCommandSelect(item: ListItem) {
  if (item.id === 'cmd-toggle-sidebar') sidebarOpen.value = !sidebarOpen.value
  else if (item.id === 'cmd-toggle-panel') panelVisible.value = !panelVisible.value
  else if (item.id === 'cmd-toggle-chat') chatOpen.value = !chatOpen.value
  else if (item.id === 'cmd-close-tab' && activeTabId.value) closeTab(activeTabId.value)
}

// ---------------------------------------------------------------------------
// Context Menu
// ---------------------------------------------------------------------------
const ctxMenuOpen = ref(false)
const ctxMenuX = ref(0)
const ctxMenuY = ref(0)
const ctxMenuItems = ref<Action[]>([])
let ctxMenuClosedAt = 0

watch(ctxMenuOpen, (open) => {
  if (!open) ctxMenuClosedAt = Date.now()
})

function openCtxMenu(e: MouseEvent, items: Action[]) {
  e.preventDefault()
  if (Date.now() - ctxMenuClosedAt < 100) return
  ctxMenuItems.value = items
  ctxMenuX.value = e.clientX + 6
  ctxMenuY.value = e.clientY - 8
  ctxMenuOpen.value = true
}

function onTreeContextMenu(payload: { node: TreeNode; event: MouseEvent }) {
  openCtxMenu(payload.event, payload.node.children ? registryCtxItems : recordCtxItems)
}

function onTabContextMenu(e: MouseEvent) {
  openCtxMenu(e, tabCtxItems)
}

// ---------------------------------------------------------------------------
// Chat Panel
// ---------------------------------------------------------------------------
const chatOpen = ref(false)
const chatMode = ref<string>('Ask')
const chatModel = ref<string>('Claude 3.5 Sonnet')
const chatContext = ref<string>('current-record')

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

// ---------------------------------------------------------------------------
// Gear menu (theme toggle)
// ---------------------------------------------------------------------------
const gearMenuOpen = ref(false)
const gearMenuX = ref(0)
const gearMenuY = ref(0)

function showGearMenu(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  gearMenuX.value = rect.right + 4
  gearMenuY.value = rect.top - 40
  gearMenuOpen.value = true
}

const gearMenuItems: Action[] = [
  { id: 'settings', label: 'Settings' },
]

// ---------------------------------------------------------------------------
// Menu actions
// ---------------------------------------------------------------------------
function onMenuSelect(action: Action) {
  switch (action.id) {
    case 'command-palette': commandPaletteOpen.value = true; break
    case 'toggle-sidebar': sidebarOpen.value = !sidebarOpen.value; break
    case 'toggle-panel': panelVisible.value = !panelVisible.value; break
    case 'toggle-chat': chatOpen.value = !chatOpen.value; break
    case 'save':
      toastRef.value?.add({ message: `Saved ${activeTabId.value}`, variant: 'info', duration: 3000 })
      break
    case 'new-record':
      toastRef.value?.add({ message: 'New record created', variant: 'info', duration: 3000 })
      break
  }
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------
const domainRecordCount = computed(() =>
  mockRecords.filter((r) => r.domain === activeDomain.value).length,
)

const unsavedCount = computed(() =>
  editorTabs.value.filter((t) => t.dirty).length,
)

const statusBarItems = computed(() =>
  buildStatusBarItems(
    activeDomain.value,
    domainRecordCount.value,
    activeRecord.value?.registry,
    unsavedCount.value,
  ),
)

// ---------------------------------------------------------------------------
// Global keyboard shortcuts
// ---------------------------------------------------------------------------
function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault(); commandPaletteOpen.value = true
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'b') {
    e.preventDefault(); sidebarOpen.value = !sidebarOpen.value
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'j') {
    e.preventDefault(); panelVisible.value = !panelVisible.value
  }
  if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault(); chatOpen.value = !chatOpen.value
  }
}

onMounted(() => document.addEventListener('keydown', onGlobalKeydown))
onUnmounted(() => document.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <Story
    title="Mock Obelisk"
    icon="lucide:landmark"
    :layout="{ type: 'single', iframe: true }"
  >
    <Variant title="Full App">
      <div class="obelisk-mock" :data-domain="activeDomain">
        <!-- Title Bar -->
        <div class="obelisk-titlebar">
          <Menubar :items="menubarItems" @select="onMenuSelect" />
          <div class="obelisk-titlebar-center">
            {{ domainMeta?.label ?? 'Obelisk' }} — Obelisk
          </div>
          <div class="obelisk-titlebar-right">
            <button class="obelisk-titlebar-btn" aria-label="Command Palette" @click="commandPaletteOpen = true">
              <Icon icon="codicon:search" size="sm" />
            </button>
            <NotificationCenter>
              <template #bell="{ unreadCount }">
                <Icon icon="codicon:bell" />
                <span v-if="unreadCount > 0" data-rig-notification-badge>{{ unreadCount }}</span>
              </template>
            </NotificationCenter>
          </div>
        </div>

        <!-- Shell Grid -->
        <ShellGrid
          v-model:sizes="shellSizes"
          resizable
          :class="{ 'panel-hidden': !panelVisible, 'sidebar-hidden': !sidebarOpen }"
        >
          <!-- Activity Bar -->
          <template #activity>
            <div class="obelisk-activity-wrapper">
              <ActivityBar
                v-model:active-id="activeActivityId"
                :items="activityItems"
                orientation="vertical"
                @select="onActivitySelect"
              >
                <template #item="{ item }">
                  <Icon :icon="item.icon" size="lg" />
                </template>
              </ActivityBar>
              <div class="obelisk-activity-bottom">
                <button
                  class="obelisk-activity-bottom-btn"
                  aria-label="Chat"
                  :data-state="chatOpen ? 'active' : 'inactive'"
                  @click="chatOpen = !chatOpen"
                >
                  <Icon icon="codicon:comment-discussion" size="lg" />
                </button>
                <button
                  class="obelisk-activity-bottom-btn"
                  aria-label="Settings"
                  @click="showGearMenu"
                >
                  <Icon icon="codicon:settings-gear" size="lg" />
                </button>
              </div>
            </div>
          </template>

          <!-- Sidebar -->
          <template #sidebar>
            <SideBar v-model:open="sidebarOpen" :width="shellSizes.sideWidth">
              <template #header>
                <Select
                  :model-value="activeDomain"
                  :options="domainOptions"
                  @change="onDomainChange"
                />
              </template>

              <!-- Explorer -->
              <template v-if="activeActivityId === 'explorer'">
                <View
                  v-for="node in registryTree"
                  :key="node.id"
                  :title="(node.label as string)"
                  :collapsed="!expandedNodes.includes(node.id)"
                  :actions="[{ id: 'new', label: 'New record', icon: 'codicon:add' }]"
                  @update:collapsed="(val: boolean) => {
                    if (val) expandedNodes = expandedNodes.filter((id) => id !== node.id)
                    else expandedNodes = [...expandedNodes, node.id]
                  }"
                  @action="() => toastRef?.add({ message: `New ${node.label} record`, variant: 'info', duration: 2000 })"
                >
                  <template #action-icon>
                    <Icon icon="codicon:add" size="sm" />
                  </template>

                  <TreeView
                    :nodes="node.children ?? []"
                    :selected="activeTabId"
                    @update:selected="(id) => {
                      const rec = mockRecords.find((r) => r.id === id)
                      if (rec) openRecord(rec)
                    }"
                    @activate="(n) => {
                      const rec = mockRecords.find((r) => r.id === n.id)
                      if (rec) openRecord(rec)
                    }"
                    @contextmenu="onTreeContextMenu"
                  >
                    <template #node="{ node: treeNode }">
                      <span class="obelisk-tree-row">
                        <Icon icon="codicon:file" size="sm" />
                        <span data-rig-tree-node-label>{{ treeNode.label }}</span>
                      </span>
                    </template>
                  </TreeView>
                </View>
              </template>

              <!-- Search -->
              <template v-if="activeActivityId === 'search'">
                <View title="SEARCH">
                  <div class="obelisk-search-placeholder">
                    <input type="text" placeholder="Search records..." class="obelisk-search-input" />
                  </div>
                  <EmptyState title="Search records" description="Type to find records across this domain." />
                </View>
              </template>
            </SideBar>
          </template>

          <!-- Editor -->
          <template #editor>
            <div class="obelisk-editor-area" :class="{ 'obelisk-editor-with-chat': chatOpen }">
              <div class="obelisk-editor-main">
                <EditorWorkbench
                  v-model:active-id="activeTabId"
                  :tabs="editorTabs"
                  @close="closeTab"
                >
                  <template #tab="{ tab }">
                    <span class="obelisk-tab-inner" @contextmenu="(e: MouseEvent) => onTabContextMenu(e)">
                      <Icon v-if="tab.icon" :icon="tab.icon" size="sm" />
                      <span
                        data-rig-editor-tab-label
                      >{{ tab.label }}</span>
                      <span v-if="tab.dirty" data-rig-editor-tab-dirty aria-label="Unsaved changes" />
                      <button v-if="tab.closable !== false" data-rig-editor-tab-close aria-label="Close" tabindex="-1" @click.stop="closeTab(tab.id as string)">
                        &times;
                      </button>
                    </span>
                  </template>

                  <template v-if="activeRecord">
                    <Breadcrumbs :items="breadcrumbs" />
                    <RecordViewer :record="activeRecord" @edit="toastRef?.add({ message: 'Entering edit mode', variant: 'info', duration: 2000 })" />
                  </template>

                  <template v-else>
                    <div class="obelisk-welcome">
                      <h2>{{ domainMeta?.label ?? 'Obelisk' }}</h2>
                      <p>Select a record from the sidebar to begin.</p>
                      <div class="obelisk-welcome-stats">
                        <div class="obelisk-welcome-stat">
                          <span class="obelisk-welcome-stat-value">{{ domainRecordCount }}</span>
                          <span class="obelisk-welcome-stat-label">records</span>
                        </div>
                        <div class="obelisk-welcome-stat">
                          <span class="obelisk-welcome-stat-value">{{ registryTree.length }}</span>
                          <span class="obelisk-welcome-stat-label">registries</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </EditorWorkbench>
              </div>

              <!-- Chat Panel -->
              <ChatPanel
                v-if="chatOpen"
                v-model:mode="chatMode"
                v-model:model="chatModel"
                v-model:context="chatContext"
                :modes="chatModes"
                :models="chatModels"
                :contexts="chatContexts"
                @close="chatOpen = false"
              />
            </div>
          </template>

          <!-- Panel -->
          <template #panel>
            <Panel
              v-if="panelVisible"
              :open="panelVisible"
              position="bottom"
              :size="shellSizes.panelHeight"
              @update:open="(val: boolean) => panelVisible = val"
              @update:size="(val: number) => shellSizes.panelHeight = val"
            >
              <template #header>
                <PanelBar v-model:active-id="activePanelId" :tabs="panelTabs" />
              </template>

              <div v-if="activePanelId === 'activity'" class="obelisk-panel-content">
                <List :items="activityLogItems" />
              </div>
              <div v-else class="obelisk-panel-content">
                <EmptyState title="No Problems" description="No issues detected in the current vault." />
              </div>
            </Panel>
          </template>

          <!-- Status Bar -->
          <template #statusbar>
            <div class="obelisk-statusbar-row">
              <StatusBar :items="statusBarItems" />
              <button
                class="obelisk-panel-toggle"
                :class="{ active: panelVisible }"
                aria-label="Toggle Panel"
                @click="panelVisible = !panelVisible"
              >
                <Icon :icon="panelVisible ? 'codicon:layout-panel-off' : 'codicon:layout-panel'" size="sm" />
              </button>
            </div>
          </template>
        </ShellGrid>

        <!-- Overlays -->
        <CommandPalette v-model:open="commandPaletteOpen" :items="commandPaletteItems" placeholder="Search commands..." @select="onCommandSelect" />
        <ContextMenu v-model:open="ctxMenuOpen" :x="ctxMenuX" :y="ctxMenuY" :items="ctxMenuItems" />
        <ContextMenu v-model:open="gearMenuOpen" :x="gearMenuX" :y="gearMenuY" :items="gearMenuItems" />
        <Toast ref="toastRef" />
        <Tooltip />
      </div>
    </Variant>
  </Story>
</template>

<style>
/* Import shared showcase sub-component styles */
@import './components/showcase.css';
</style>

<style scoped>
/* =========================================================================
   Mock Obelisk — App-specific layout styles
   Rig component theming is handled by Hex. These styles only cover
   the custom layout structure of the Obelisk showcase itself.
   ========================================================================= */

/* ---- Root ---- */
.obelisk-mock {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  color: var(--color-parchment, #d4d4d4);
  background: var(--color-ink, #1e1e1e);
}

/* ---- Title Bar ---- */
.obelisk-titlebar {
  display: flex;
  align-items: center;
  height: 36px;
  min-height: 36px;
  background: var(--color-ink-light, #323233);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0 8px;
  gap: 8px;
  -webkit-app-region: drag;
  position: relative;
  z-index: 10;
}

.obelisk-titlebar-center {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  opacity: 0.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.obelisk-titlebar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.obelisk-titlebar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 22px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--color-parchment, #ccc);
  cursor: pointer;
  -webkit-app-region: no-drag;
}

.obelisk-titlebar-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ---- Tab inner wrapper ---- */
.obelisk-tab-inner {
  display: contents;
}

/* ---- Activity Bar ---- */
.obelisk-activity-wrapper {
  display: flex;
  flex-direction: column;
  width: 48px;
  height: 100%;
  background: var(--color-ink, #252526);
}

.obelisk-activity-wrapper :deep([data-rig-activity-bar]) {
  flex: 1;
  min-height: 0;
}

.obelisk-activity-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  gap: 2px;
}

.obelisk-activity-bottom-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-muted, #858585);
  cursor: pointer;
  position: relative;
}

.obelisk-activity-bottom-btn:hover {
  color: var(--color-parchment, #fff);
}

.obelisk-activity-bottom-btn[data-state="active"] {
  color: var(--color-parchment, #fff);
}

/* ---- Tree row ---- */
.obelisk-tree-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  height: 100%;
  cursor: pointer;
}

/* ---- Editor area ---- */
.obelisk-editor-area {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: var(--color-ink, #1e1e1e);
}

.obelisk-editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  height: 100%;
}

.obelisk-editor-main :deep([data-rig-editor-workbench]) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ---- Panel ---- */
.obelisk-panel-content {
  padding: 8px;
  overflow: auto;
}

/* ---- Status bar row ---- */
.obelisk-statusbar-row {
  display: flex;
  align-items: stretch;
  width: 100%;
}

.obelisk-statusbar-row :deep([data-rig-status-bar]) {
  flex: 1;
}

.obelisk-panel-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  background: var(--color-bronze, #007acc);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
}

.obelisk-panel-toggle:hover {
  color: #fff;
  background: color-mix(in srgb, var(--color-bronze, #007acc) 100%, #fff 15%);
}

.obelisk-panel-toggle.active {
  color: #fff;
}

/* ---- Welcome screen ---- */
.obelisk-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: var(--color-muted, #888);
}

.obelisk-welcome h2 {
  font-size: 28px;
  font-weight: 300;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  color: var(--color-parchment, #ccc);
  margin: 0;
}

.obelisk-welcome p {
  font-size: 14px;
  margin: 0;
}

.obelisk-welcome-stats {
  display: flex;
  gap: 32px;
  margin-top: 16px;
}

.obelisk-welcome-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.obelisk-welcome-stat-value {
  font-size: 24px;
  font-weight: 300;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  color: var(--color-bronze, #c9956d);
}

.obelisk-welcome-stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ---- Search ---- */
.obelisk-search-placeholder {
  padding: 8px;
}

.obelisk-search-input {
  width: 100%;
  padding: 4px 8px;
  background: var(--color-ink-light, #3c3c3c);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--color-parchment, #ccc);
  font-size: 13px;
  outline: none;
}

.obelisk-search-input:focus {
  border-color: var(--color-bronze, #c9956d);
}

/* ---- Shell Grid collapse helpers ---- */
.panel-hidden :deep([data-rig-shell-panel]) {
  height: 0 !important;
  overflow: hidden;
}

.panel-hidden :deep([data-rig-resizer][data-orientation="vertical"]) {
  display: none;
}

.sidebar-hidden :deep([data-rig-shell-sidebar]) {
  width: 0 !important;
  overflow: hidden;
}

.sidebar-hidden :deep([data-rig-resizer][data-orientation="horizontal"]) {
  display: none;
}
</style>
