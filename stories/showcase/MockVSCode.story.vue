<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, watch } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'

// ---- Rig Components ----
import ShellGrid from '@layout/ShellGrid.vue'
import Accordion from '@layout/Accordion.vue'
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
import KeyboardHint from '@menus/KeyboardHint.vue'
import Icon from '@core/primitives/Icon.vue'
import NotificationCenter from '@extras/NotificationCenter.vue'
import Toast from '@extras/Toast.vue'
import Tooltip from '@extras/Tooltip.vue'

// ---- Showcase sub-components ----
import CodeViewer from './components/CodeViewer.vue'
import ChatPanel from './components/ChatPanel.vue'
import TerminalEmulator from './components/TerminalEmulator.vue'

// ---- Fixtures ----
import {
  menubarItems,
  commandPaletteItems,
  editorCtxItems,
  accountsCtxItems,
  settingsCtxItems,
  fileCtxItems,
  folderCtxItems,
} from './fixtures/ide-menus'
import {
  activityItems,
  explorerTree,
  outlineTree,
  extensionItems,
  panelTabs,
  problemItems,
  initialTerminalLines,
  outputLines,
  statusBarItems,
  defaultEditorTabs,
  chatModes,
  chatModels,
  chatContexts,
} from './fixtures/ide-data'
import { files } from './fixtures/ide-files'
import type { FileContent } from './fixtures/ide-files'

// ---- Types ----
import type { Action, TabItem, TreeNode, ListItem } from '@core/types'

const { theme, themeOptions } = useHexTheme()

// ---------------------------------------------------------------------------
// Activity Bar
// ---------------------------------------------------------------------------
const activeActivityId = ref('explorer')
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

const explorerExpanded = ref<string[]>(['src', 'src/components'])
const explorerSelected = ref<string>('App.vue')
const outlineCollapsed = ref(false)
const outlineExpanded = ref<string[]>(['ol-script', 'ol-template'])
const outlineSelected = ref<string>('')
const searchViewCollapsed = ref(true)
const scmAccordionValue = ref<string[]>(['changes'])
const selectedExtension = ref('')

// ---------------------------------------------------------------------------
// Editor Tabs & Content
// ---------------------------------------------------------------------------
const editorTabs = ref<TabItem[]>([...defaultEditorTabs])
const activeTabId = ref('App.vue')

const activeFile = computed<FileContent | null>(() => {
  return files[activeTabId.value] ?? null
})

function openFile(nodeId: string) {
  const file = files[nodeId]
  if (!file) return
  if (!editorTabs.value.find((t) => t.id === file.id)) {
    const icon =
      file.language === 'vue' ? 'mdi:vuejs'
      : file.language === 'json' ? 'codicon:json'
      : 'codicon:file-code'
    editorTabs.value.push({ id: file.id, label: file.label, icon, closable: true, dirty: file.dirty })
  }
  activeTabId.value = file.id
  explorerSelected.value = nodeId
}

function closeTab(id: string) {
  const idx = editorTabs.value.findIndex((t) => t.id === id)
  if (idx < 0) return
  editorTabs.value.splice(idx, 1)
  if (activeTabId.value === id) {
    activeTabId.value = editorTabs.value[Math.min(idx, editorTabs.value.length - 1)]?.id ?? ''
  }
}

function reorderTabs(payload: { from: number; to: number }) {
  const tab = editorTabs.value.splice(payload.from, 1)[0]!
  editorTabs.value.splice(payload.to, 0, tab)
}

// Breadcrumbs
const breadcrumbs = ref<{ id: string; label: string }[]>([])
watchEffect(() => {
  const id = activeTabId.value
  if (!id) { breadcrumbs.value = []; return }
  const parts: { id: string; label: string }[] = [
    { id: 'root', label: 'my-vue-app' },
    { id: 'src-crumb', label: 'src' },
  ]
  if (id.includes('World') || id.includes('Header') || id.includes('Footer')) {
    parts.push({ id: 'components-crumb', label: 'components' })
  }
  if (id.includes('View')) {
    parts.push({ id: 'views-crumb', label: 'views' })
  }
  parts.push({ id: 'file-crumb', label: id })
  breadcrumbs.value = parts
})

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------
const panelVisible = ref(false)
const activePanelId = ref('terminal')
const terminalLines = ref([...initialTerminalLines])

function onTerminalCommand(cmd: string) {
  terminalLines.value.push(`$ ${cmd}`)
  if (cmd === 'clear') {
    terminalLines.value = []
  } else if (cmd === 'ls') {
    terminalLines.value.push('node_modules/  public/  src/  index.html  package.json  tsconfig.json  vite.config.ts')
  } else if (cmd === 'pnpm build') {
    terminalLines.value.push('vite v7.3.1 building for production...')
    terminalLines.value.push('\u2713 23 modules transformed.')
    terminalLines.value.push('dist/index.html  0.42 kB \u2502 gzip: 0.27 kB')
    terminalLines.value.push('dist/assets/index-BfXk2.js  52.18 kB \u2502 gzip: 18.32 kB')
    terminalLines.value.push('\u2713 built in 1.84s')
  } else {
    terminalLines.value.push(`zsh: command not found: ${cmd}`)
  }
}

// ---------------------------------------------------------------------------
// Command Palette
// ---------------------------------------------------------------------------
const commandPaletteOpen = ref(false)

function onCommandSelect(item: ListItem) {
  if (item.id === 'cmd-toggle-sidebar') sidebarOpen.value = !sidebarOpen.value
  else if (item.id === 'cmd-toggle-panel') panelVisible.value = !panelVisible.value
  else if (item.id === 'cmd-toggle-terminal') {
    panelVisible.value = !panelVisible.value
    if (panelVisible.value) activePanelId.value = 'terminal'
  } else if (item.id === 'cmd-close-tab' && activeTabId.value) {
    closeTab(activeTabId.value)
  }
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
  openCtxMenu(payload.event, payload.node.children ? folderCtxItems : fileCtxItems)
}

function onTabContextMenu(e: MouseEvent, tabId: string) {
  e.preventDefault()
  const tab = editorTabs.value.find((t) => t.id === tabId)
  const items: Action[] = [
    { id: 'tab-close', label: 'Close', keybinding: 'Ctrl+W' },
    { id: 'tab-close-others', label: 'Close Others' },
    { id: 'tab-close-right', label: 'Close to the Right' },
    { id: 'tab-close-saved', label: 'Close Saved' },
    { id: 'tab-close-all', label: 'Close All', keybinding: 'Ctrl+K Ctrl+W' },
    { id: 'tab-pin', label: tab?.pinned ? 'Unpin' : 'Pin' },
    { id: 'tab-copy-path', label: 'Copy Path', keybinding: 'Ctrl+Shift+C' },
    { id: 'tab-copy-rel', label: 'Copy Relative Path' },
  ]
  openCtxMenu(e, items)
}

function onEditorContextMenu(e: MouseEvent) {
  openCtxMenu(e, editorCtxItems)
}

// ---------------------------------------------------------------------------
// Chat Panel
// ---------------------------------------------------------------------------
const chatOpen = ref(false)
const chatMode = ref<string>('Ask')
const chatModel = ref<string>('Claude 3.5 Sonnet')
const chatContext = ref<string>('current-file')

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

// ---------------------------------------------------------------------------
// Menu actions
// ---------------------------------------------------------------------------
function onMenuSelect(action: Action) {
  switch (action.id) {
    case 'command-palette': commandPaletteOpen.value = true; break
    case 'toggle-sidebar': sidebarOpen.value = !sidebarOpen.value; break
    case 'toggle-panel': panelVisible.value = !panelVisible.value; break
    case 'toggle-terminal':
      panelVisible.value = !panelVisible.value
      if (panelVisible.value) activePanelId.value = 'terminal'
      break
    case 'save':
      toastRef.value?.add({ message: `Saved ${activeTabId.value}`, variant: 'info', duration: 3000 })
      break
    case 'new-file':
      toastRef.value?.add({ message: 'New file created', variant: 'info', duration: 3000 })
      break
  }
}

// ---------------------------------------------------------------------------
// Global keyboard shortcuts
// ---------------------------------------------------------------------------
function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
    e.preventDefault(); commandPaletteOpen.value = true
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'b') {
    e.preventDefault(); sidebarOpen.value = !sidebarOpen.value
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'j') {
    e.preventDefault(); panelVisible.value = !panelVisible.value
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === '`') {
    e.preventDefault()
    panelVisible.value = !panelVisible.value
    if (panelVisible.value) activePanelId.value = 'terminal'
  }
}

onMounted(() => document.addEventListener('keydown', onGlobalKeydown))
onUnmounted(() => document.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <Story
    title="Showcase / Mock VS Code"
    icon="lucide:monitor"
    :layout="{ type: 'single', iframe: true }"
  >
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Full IDE">
      <div class="ide-mock">
        <!-- Title Bar -->
        <div class="ide-titlebar">
          <Menubar :items="menubarItems" @select="onMenuSelect" />
          <div class="ide-titlebar-center">my-vue-app - Rig IDE</div>
          <div class="ide-titlebar-right">
            <button class="ide-titlebar-btn" aria-label="Command Palette" @click="commandPaletteOpen = true">
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
            <div class="ide-activity-wrapper">
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
              <div class="ide-activity-bottom">
                <button
                  class="ide-activity-bottom-btn"
                  aria-label="Chat"
                  :data-state="chatOpen ? 'active' : 'inactive'"
                  @click="chatOpen = !chatOpen"
                >
                  <Icon icon="codicon:comment-discussion" size="lg" />
                </button>
                <button class="ide-activity-bottom-btn" aria-label="Accounts" @click="(e) => openCtxMenu(e, accountsCtxItems)">
                  <Icon icon="codicon:account" size="lg" />
                </button>
                <button class="ide-activity-bottom-btn" aria-label="Manage" @click="(e) => openCtxMenu(e, settingsCtxItems)">
                  <Icon icon="codicon:settings-gear" size="lg" />
                </button>
              </div>
            </div>
          </template>

          <!-- Sidebar -->
          <template #sidebar>
            <SideBar v-model:open="sidebarOpen" :width="shellSizes.sideWidth">
              <template #header>
                <div class="ide-sidebar-title">EXPLORER</div>
              </template>

              <!-- Explorer -->
              <View
                v-if="activeActivityId === 'explorer'"
                title="MY-VUE-APP"
                :actions="[{ id: 'new-file', label: 'New File' }, { id: 'refresh', label: 'Refresh' }]"
              >
                <TreeView
                  v-model:expanded="explorerExpanded"
                  :nodes="explorerTree"
                  :selected="explorerSelected"
                  @update:selected="(v) => explorerSelected = v as string"
                  @activate="(n) => openFile(n.id as string)"
                  @contextmenu="onTreeContextMenu"
                >
                  <template #node="{ node, toggle }">
                    <span class="ide-tree-row" @click.stop="node.children ? toggle() : openFile(node.id as string)">
                      <Icon v-if="node.icon" :icon="node.icon" size="sm" />
                      <span data-rig-tree-node-label>{{ node.label }}</span>
                    </span>
                  </template>
                </TreeView>
              </View>

              <!-- Outline -->
              <View v-if="activeActivityId === 'explorer'" v-model:collapsed="outlineCollapsed" title="OUTLINE">
                <TreeView
                  v-model:expanded="outlineExpanded"
                  :nodes="outlineTree"
                  :selected="outlineSelected"
                  @update:selected="(v) => outlineSelected = v as string"
                >
                  <template #node="{ node, toggle }">
                    <span class="ide-tree-row" @click.stop="node.children ? toggle() : undefined">
                      <Icon v-if="node.icon" :icon="node.icon" size="sm" />
                      <span data-rig-tree-node-label>{{ node.label }}</span>
                    </span>
                  </template>
                </TreeView>
              </View>

              <!-- Search -->
              <View v-if="activeActivityId === 'search'" v-model:collapsed="searchViewCollapsed" title="SEARCH">
                <div class="ide-search-placeholder">
                  <input type="text" placeholder="Search" class="ide-search-input" />
                </div>
              </View>

              <!-- Source Control -->
              <View v-if="activeActivityId === 'source-control'" title="SOURCE CONTROL">
                <div class="ide-scm-placeholder">
                  <Accordion v-model="scmAccordionValue" type="multiple" collapsible>
                    <template #default="{ isOpen, headerId, panelId, toggle }">
                      <div data-rig-accordion-item>
                        <button :id="headerId('staged')" data-rig-accordion-trigger :aria-expanded="isOpen('staged')" :aria-controls="panelId('staged')" @click="toggle('staged')">
                          Staged Changes (1)
                        </button>
                        <div v-show="isOpen('staged')" :id="panelId('staged')" data-rig-accordion-panel role="region" :aria-labelledby="headerId('staged')">
                          <div class="ide-scm-file">M  HelloWorld.vue</div>
                        </div>
                      </div>
                      <div data-rig-accordion-item>
                        <button :id="headerId('changes')" data-rig-accordion-trigger :aria-expanded="isOpen('changes')" :aria-controls="panelId('changes')" @click="toggle('changes')">
                          Changes (2)
                        </button>
                        <div v-show="isOpen('changes')" :id="panelId('changes')" data-rig-accordion-panel role="region" :aria-labelledby="headerId('changes')">
                          <div class="ide-scm-file">M  App.vue</div>
                          <div class="ide-scm-file">U  router.ts</div>
                        </div>
                      </div>
                    </template>
                  </Accordion>
                </div>
              </View>

              <!-- Extensions -->
              <View v-if="activeActivityId === 'extensions'" title="EXTENSIONS">
                <List :items="extensionItems" :selected="selectedExtension" @update:selected="(v) => selectedExtension = v as string" />
              </View>

              <!-- Debug -->
              <View v-if="activeActivityId === 'debug'" title="RUN AND DEBUG">
                <div class="ide-debug-placeholder">
                  <p>No configurations found.</p>
                  <button class="ide-debug-btn">Create a launch.json file</button>
                </div>
              </View>
            </SideBar>
          </template>

          <!-- Editor -->
          <template #editor>
            <div class="ide-editor-area" :class="{ 'ide-editor-with-chat': chatOpen }">
              <EditorWorkbench
                v-model:active-id="activeTabId"
                :tabs="editorTabs"
                @close="closeTab"
                @reorder="reorderTabs"
              >
                <template #tab="{ tab }">
                  <span class="ide-tab-inner" @contextmenu="(e: MouseEvent) => onTabContextMenu(e, tab.id as string)">
                    <Icon v-if="tab.icon" :icon="tab.icon" size="sm" />
                    <span data-rig-editor-tab-label>{{ tab.label }}</span>
                    <span v-if="tab.dirty" data-rig-editor-tab-dirty aria-label="Unsaved changes" />
                    <button v-if="tab.closable !== false" data-rig-editor-tab-close aria-label="Close" tabindex="-1" @click.stop="closeTab(tab.id as string)">
                      &times;
                    </button>
                  </span>
                </template>

                <template v-if="activeFile">
                  <Breadcrumbs :items="breadcrumbs" :separator="' \u203A '" />
                  <CodeViewer :content="activeFile.content" @contextmenu="onEditorContextMenu" />
                </template>

                <template v-else>
                  <div class="ide-welcome">
                    <h2>Rig IDE</h2>
                    <p>Open a file from the explorer to get started.</p>
                    <div class="ide-welcome-shortcuts">
                      <div class="ide-welcome-row">
                        <span>Show All Commands</span>
                        <KeyboardHint shortcut="Ctrl+Shift+P" />
                      </div>
                      <div class="ide-welcome-row">
                        <span>Go to File</span>
                        <KeyboardHint shortcut="Ctrl+P" />
                      </div>
                      <div class="ide-welcome-row">
                        <span>Toggle Terminal</span>
                        <KeyboardHint shortcut="Ctrl+&#96;" />
                      </div>
                    </div>
                  </div>
                </template>
              </EditorWorkbench>

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
            <div v-if="panelVisible" class="ide-panel-area">
              <PanelBar v-model:active-id="activePanelId" :tabs="panelTabs" />
              <div class="ide-panel-content">
                <div v-if="activePanelId === 'problems'" class="ide-problems">
                  <List :items="problemItems" @activate="(item) => toastRef?.add({ message: `Navigated to ${item.label}`, variant: 'info', duration: 2000 })" />
                </div>
                <div v-if="activePanelId === 'output'" class="showcase-mono-panel">
                  <pre class="showcase-terminal-pre"><code>{{ outputLines.join('\n') }}</code></pre>
                </div>
                <div v-if="activePanelId === 'terminal'">
                  <TerminalEmulator :lines="terminalLines" @execute="onTerminalCommand" />
                </div>
                <div v-if="activePanelId === 'debug-console'" class="showcase-mono-panel">
                  <pre class="showcase-terminal-pre"><code>No debug session active.</code></pre>
                </div>
              </div>
            </div>
          </template>

          <!-- Status Bar -->
          <template #statusbar>
            <div class="ide-statusbar-row">
              <StatusBar :items="statusBarItems" />
              <button
                class="ide-terminal-toggle"
                :class="{ active: panelVisible }"
                aria-label="Toggle Terminal"
                @click="panelVisible = !panelVisible; if (panelVisible) activePanelId = 'terminal'"
              >
                <Icon icon="codicon:terminal" size="sm" />
              </button>
            </div>
          </template>
        </ShellGrid>

        <!-- Overlays -->
        <CommandPalette v-model:open="commandPaletteOpen" :items="commandPaletteItems" placeholder="> Type a command..." @select="onCommandSelect" />
        <ContextMenu v-model:open="ctxMenuOpen" :x="ctxMenuX" :y="ctxMenuY" :items="ctxMenuItems" />
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
   Mock VS Code — App-specific layout styles
   Rig component theming is handled by Hex. These styles only cover
   the custom layout structure of the IDE showcase itself.
   ========================================================================= */

/* ---- Root ---- */
.ide-mock {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  color: var(--color-parchment, #d4d4d4);
  background: var(--color-ink, #1e1e1e);
}

/* ---- Title Bar ---- */
.ide-titlebar {
  display: flex;
  align-items: center;
  height: 30px;
  min-height: 30px;
  background: var(--color-ink-light, #323233);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0 8px;
  gap: 8px;
  -webkit-app-region: drag;
  position: relative;
  z-index: 10;
}

.ide-titlebar-center {
  flex: 1;
  text-align: center;
  font-size: 12px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ide-titlebar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ide-titlebar-btn {
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

.ide-titlebar-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ---- Tab inner wrapper (display: contents for contextmenu) ---- */
.ide-tab-inner {
  display: contents;
}

/* ---- Activity Bar ---- */
.ide-activity-wrapper {
  display: flex;
  flex-direction: column;
  width: 48px;
  height: 100%;
  background: var(--color-ink, #252526);
}

.ide-activity-wrapper :deep([data-rig-activity-bar]) {
  flex: 1;
  min-height: 0;
}

.ide-activity-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  gap: 2px;
}

.ide-activity-bottom-btn {
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
  font-size: 11px;
  position: relative;
}

.ide-activity-bottom-btn:hover {
  color: var(--color-parchment, #fff);
}

.ide-activity-bottom-btn[data-state="active"] {
  color: var(--color-parchment, #fff);
}

/* ---- Sidebar ---- */
.ide-sidebar-title {
  padding: 10px 12px 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-muted, #bbb);
}

/* ---- Tree row (clickable expand/select area) ---- */
.ide-tree-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  height: 100%;
  cursor: pointer;
}

/* Leaf nodes: offset to align with folder icons */
.ide-mock :deep([data-leaf] .ide-tree-row) {
  padding-inline-start: 16px;
}

/* ---- Editor area ---- */
.ide-editor-area {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: var(--color-ink, #1e1e1e);
}

/* ---- Panel ---- */
.ide-panel-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-ink, #1e1e1e);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.ide-panel-content {
  flex: 1;
  overflow: auto;
}

.ide-problems {
  padding: 0;
}

/* ---- Status bar row ---- */
.ide-statusbar-row {
  display: flex;
  align-items: stretch;
  width: 100%;
}

.ide-statusbar-row :deep([data-rig-status-bar]) {
  flex: 1;
}

.ide-terminal-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  background: var(--color-bronze, #007acc);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}

.ide-terminal-toggle:hover {
  color: #fff;
  background: color-mix(in srgb, var(--color-bronze, #007acc) 100%, #fff 15%);
}

.ide-terminal-toggle.active {
  color: #fff;
}

/* ---- Welcome screen ---- */
.ide-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--color-muted, #888);
}

.ide-welcome h2 {
  font-size: 28px;
  font-weight: 300;
  color: var(--color-parchment, #ccc);
  margin: 0;
}

.ide-welcome p {
  font-size: 14px;
  margin: 0;
}

.ide-welcome-shortcuts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.ide-welcome-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  font-size: 13px;
}

/* ---- SCM files ---- */
.ide-scm-file {
  padding: 2px 24px;
  font-size: 13px;
  color: var(--color-parchment, #ccc);
}

/* ---- Search ---- */
.ide-search-placeholder {
  padding: 8px;
}

.ide-search-input {
  width: 100%;
  padding: 4px 8px;
  background: var(--color-ink-light, #3c3c3c);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--color-parchment, #ccc);
  font-size: 13px;
  outline: none;
}

.ide-search-input:focus {
  border-color: var(--color-bronze, #007acc);
}

/* ---- Debug ---- */
.ide-debug-placeholder {
  padding: 20px 12px;
  text-align: center;
  color: var(--color-muted, #888);
  font-size: 13px;
}

.ide-debug-btn {
  margin-top: 12px;
  padding: 6px 14px;
  background: var(--color-bronze, #007acc);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.ide-debug-btn:hover {
  opacity: 0.9;
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
