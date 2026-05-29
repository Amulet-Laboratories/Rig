<!--
  SplitEditorArea — Multi-pane editor layout.

  Injects PaneState (provided by usePaneState({ provide: true }) in the parent
  shell composable) and renders nested SplitViews + EditorWorkbenches for each
  active pane group.

  Layout configurations:
    tl only             → single workbench
    tl + tr             → SplitView[horizontal] → [tl, tr]
    tl + bl             → SplitView[vertical]   → [tl, bl]
    tl + tr + bl        → SplitView[h] → [SplitView[v][tl,bl], tr]
    tl + tr + bl + br   → SplitView[h] → [SplitView[v][tl,bl], SplitView[v][tr,br]]

  The #default slot receives { paneId, activeTab, pane } for each workbench content area.
  The #empty slot receives { paneId } when a pane has no open tabs.

  Usage:
  ```vue
  <SplitEditorArea
    @pane-tab-contextmenu="(p) => showTabMenu(p.tab, p.event, p.paneId)"
    @pane-focus="(paneId) => panes.focusPane(paneId)"
    @pane-tab-close="(p) => panes.closeTabInPane(p.paneId, p.tabId)"
    @pane-tab-activate="(p) => panes.setActivePaneTab(p.paneId, p.tabId)"
    @pane-tab-reorder="(p) => panes.reorderPaneTabs(p.paneId, { from: p.from, to: p.to })"
  >
    <template #default="{ paneId, activeTab }">
      <MyEditor :tab="activeTab" />
    </template>
    <template #empty="{ paneId }">
      <EmptyState title="No open pages" />
    </template>
  </SplitEditorArea>
  ```
-->
<script setup lang="ts">
import { computed } from 'vue'
import { SplitView } from '@layout/index'
import EditorWorkbench from './EditorWorkbench.vue'
import { usePaneState } from '@shell/usePaneState'
import type { PaneId, PaneGroup } from '@shell/usePaneState'
import type { TabItem, ID } from '@core/types'

// ── Emits ──

const emit = defineEmits<{
  /** Tab activated in a pane */
  'pane-tab-activate': [payload: { paneId: PaneId; tabId: ID }]
  /** Tab closed in a pane */
  'pane-tab-close': [payload: { paneId: PaneId; tabId: ID }]
  /** Tabs reordered in a pane */
  'pane-tab-reorder': [payload: { paneId: PaneId; from: number; to: number }]
  /** Right-click on a tab in a pane */
  'pane-tab-contextmenu': [payload: { paneId: PaneId; tab: TabItem; event: MouseEvent }]
  /** User clicked inside a pane to focus it */
  'pane-focus': [paneId: PaneId]
}>()

defineSlots<{
  /**
   * Editor content for each pane's active tab.
   * Rendered inside the workbench content area.
   */
  default: (props: { paneId: PaneId; activeTab: TabItem | undefined; pane: PaneGroup }) => unknown
  /**
   * Empty state for a pane with no open tabs.
   */
  empty: (props: { paneId: PaneId }) => unknown
}>()

const panes = usePaneState()

// ── Layout flags ──

const layout = computed(() => panes.layout.value)

const showFocusRing = computed(() => panes.activePanes.value.size > 1)

// ── Per-pane helpers ──

function getPaneGroup(paneId: PaneId): PaneGroup | undefined {
  return panes.activePanes.value.get(paneId)
}

function isFocused(paneId: PaneId): boolean {
  return panes.focusedPaneId.value === paneId && showFocusRing.value
}

// ── Event forwarding ──

function onPaneClick(paneId: PaneId) {
  panes.focusPane(paneId)
  emit('pane-focus', paneId)
}

function onTabActivate(paneId: PaneId, tabId: ID) {
  emit('pane-tab-activate', { paneId, tabId })
}

function onTabClose(paneId: PaneId, tabId: ID) {
  emit('pane-tab-close', { paneId, tabId })
}

function onTabReorder(paneId: PaneId, payload: { from: number; to: number }) {
  emit('pane-tab-reorder', { paneId, ...payload })
}

function onTabContextmenu(paneId: PaneId, payload: { tab: TabItem; event: MouseEvent }) {
  emit('pane-tab-contextmenu', { paneId, ...payload })
}

function onColumnResize(newSizes: number[]) {
  if (newSizes.length === 2) {
    panes.columnSizes.value = newSizes as [number, number]
  }
}

function onRowResize(newSizes: number[]) {
  if (newSizes.length === 2) {
    panes.rowSizes.value = newSizes as [number, number]
  }
}
</script>

<template>
  <div data-rig-split-editor-area>
    <!-- ── 1. Single pane (tl only) ── -->
    <template v-if="!layout.hasRight && !layout.hasBottom">
      <div
        data-rig-pane-group
        data-pane-id="tl"
        :data-focused="isFocused('tl') || undefined"
        @click.capture="onPaneClick('tl')"
      >
        <EditorWorkbench
          :tabs="getPaneGroup('tl')?.tabs.value ?? []"
          :active-id="getPaneGroup('tl')?.activeTabId.value ?? undefined"
          @update:active-id="onTabActivate('tl', $event)"
          @close="onTabClose('tl', $event)"
          @reorder="onTabReorder('tl', $event)"
          @contextmenu="onTabContextmenu('tl', $event)"
        >
          <template #default="{ activeTab }">
            <slot :pane-id="'tl'" :active-tab="activeTab" :pane="getPaneGroup('tl')!" />
          </template>
          <template #empty>
            <slot name="empty" :pane-id="'tl'" />
          </template>
        </EditorWorkbench>
      </div>
    </template>

    <!-- ── 2. Horizontal split only (tl + tr, no bottom row) ── -->
    <template v-else-if="layout.hasRight && !layout.hasBottom">
      <SplitView
        orientation="horizontal"
        :sizes="panes.columnSizes.value"
        :min-sizes="[200, 200]"
        @update:sizes="onColumnResize"
      >
        <template #pane-0>
          <div
            data-rig-pane-group
            data-pane-id="tl"
            :data-focused="isFocused('tl') || undefined"
            @click.capture="onPaneClick('tl')"
          >
            <EditorWorkbench
              :tabs="getPaneGroup('tl')?.tabs.value ?? []"
              :active-id="getPaneGroup('tl')?.activeTabId.value ?? undefined"
              @update:active-id="onTabActivate('tl', $event)"
              @close="onTabClose('tl', $event)"
              @reorder="onTabReorder('tl', $event)"
              @contextmenu="onTabContextmenu('tl', $event)"
            >
              <template #default="{ activeTab }">
                <slot :pane-id="'tl'" :active-tab="activeTab" :pane="getPaneGroup('tl')!" />
              </template>
              <template #empty>
                <slot name="empty" :pane-id="'tl'" />
              </template>
            </EditorWorkbench>
          </div>
        </template>
        <template #pane-1>
          <div
            data-rig-pane-group
            data-pane-id="tr"
            :data-focused="isFocused('tr') || undefined"
            @click.capture="onPaneClick('tr')"
          >
            <EditorWorkbench
              :tabs="getPaneGroup('tr')?.tabs.value ?? []"
              :active-id="getPaneGroup('tr')?.activeTabId.value ?? undefined"
              @update:active-id="onTabActivate('tr', $event)"
              @close="onTabClose('tr', $event)"
              @reorder="onTabReorder('tr', $event)"
              @contextmenu="onTabContextmenu('tr', $event)"
            >
              <template #default="{ activeTab }">
                <slot :pane-id="'tr'" :active-tab="activeTab" :pane="getPaneGroup('tr')!" />
              </template>
              <template #empty>
                <slot name="empty" :pane-id="'tr'" />
              </template>
            </EditorWorkbench>
          </div>
        </template>
      </SplitView>
    </template>

    <!-- ── 3. Vertical split only (tl + bl, no right column) ── -->
    <template v-else-if="!layout.hasRight && layout.hasBottom">
      <SplitView
        orientation="vertical"
        :sizes="panes.rowSizes.value"
        :min-sizes="[150, 150]"
        @update:sizes="onRowResize"
      >
        <template #pane-0>
          <div
            data-rig-pane-group
            data-pane-id="tl"
            :data-focused="isFocused('tl') || undefined"
            @click.capture="onPaneClick('tl')"
          >
            <EditorWorkbench
              :tabs="getPaneGroup('tl')?.tabs.value ?? []"
              :active-id="getPaneGroup('tl')?.activeTabId.value ?? undefined"
              @update:active-id="onTabActivate('tl', $event)"
              @close="onTabClose('tl', $event)"
              @reorder="onTabReorder('tl', $event)"
              @contextmenu="onTabContextmenu('tl', $event)"
            >
              <template #default="{ activeTab }">
                <slot :pane-id="'tl'" :active-tab="activeTab" :pane="getPaneGroup('tl')!" />
              </template>
              <template #empty>
                <slot name="empty" :pane-id="'tl'" />
              </template>
            </EditorWorkbench>
          </div>
        </template>
        <template #pane-1>
          <div
            data-rig-pane-group
            data-pane-id="bl"
            :data-focused="isFocused('bl') || undefined"
            @click.capture="onPaneClick('bl')"
          >
            <EditorWorkbench
              :tabs="getPaneGroup('bl')?.tabs.value ?? []"
              :active-id="getPaneGroup('bl')?.activeTabId.value ?? undefined"
              @update:active-id="onTabActivate('bl', $event)"
              @close="onTabClose('bl', $event)"
              @reorder="onTabReorder('bl', $event)"
              @contextmenu="onTabContextmenu('bl', $event)"
            >
              <template #default="{ activeTab }">
                <slot :pane-id="'bl'" :active-tab="activeTab" :pane="getPaneGroup('bl')!" />
              </template>
              <template #empty>
                <slot name="empty" :pane-id="'bl'" />
              </template>
            </EditorWorkbench>
          </div>
        </template>
      </SplitView>
    </template>

    <!-- ── 4 & 5. Mixed layout (right column exists + optional bottom row) ── -->
    <template v-else>
      <SplitView
        orientation="horizontal"
        :sizes="panes.columnSizes.value"
        :min-sizes="[200, 200]"
        @update:sizes="onColumnResize"
      >
        <!-- Left column: tl (top) + bl (bottom) -->
        <template #pane-0>
          <SplitView
            orientation="vertical"
            :sizes="panes.rowSizes.value"
            :min-sizes="[150, 150]"
            @update:sizes="onRowResize"
          >
            <template #pane-0>
              <div
                data-rig-pane-group
                data-pane-id="tl"
                :data-focused="isFocused('tl') || undefined"
                @click.capture="onPaneClick('tl')"
              >
                <EditorWorkbench
                  :tabs="getPaneGroup('tl')?.tabs.value ?? []"
                  :active-id="getPaneGroup('tl')?.activeTabId.value ?? undefined"
                  @update:active-id="onTabActivate('tl', $event)"
                  @close="onTabClose('tl', $event)"
                  @reorder="onTabReorder('tl', $event)"
                  @contextmenu="onTabContextmenu('tl', $event)"
                >
                  <template #default="{ activeTab }">
                    <slot :pane-id="'tl'" :active-tab="activeTab" :pane="getPaneGroup('tl')!" />
                  </template>
                  <template #empty>
                    <slot name="empty" :pane-id="'tl'" />
                  </template>
                </EditorWorkbench>
              </div>
            </template>
            <template #pane-1>
              <div
                data-rig-pane-group
                data-pane-id="bl"
                :data-focused="isFocused('bl') || undefined"
                @click.capture="onPaneClick('bl')"
              >
                <EditorWorkbench
                  :tabs="getPaneGroup('bl')?.tabs.value ?? []"
                  :active-id="getPaneGroup('bl')?.activeTabId.value ?? undefined"
                  @update:active-id="onTabActivate('bl', $event)"
                  @close="onTabClose('bl', $event)"
                  @reorder="onTabReorder('bl', $event)"
                  @contextmenu="onTabContextmenu('bl', $event)"
                >
                  <template #default="{ activeTab }">
                    <slot :pane-id="'bl'" :active-tab="activeTab" :pane="getPaneGroup('bl')!" />
                  </template>
                  <template #empty>
                    <slot name="empty" :pane-id="'bl'" />
                  </template>
                </EditorWorkbench>
              </div>
            </template>
          </SplitView>
        </template>

        <!-- Right column: tr (top) + br (bottom, if it exists) -->
        <template #pane-1>
          <SplitView
            v-if="layout.hasBottomRight"
            orientation="vertical"
            :sizes="panes.rowSizes.value"
            :min-sizes="[150, 150]"
            @update:sizes="onRowResize"
          >
            <template #pane-0>
              <div
                data-rig-pane-group
                data-pane-id="tr"
                :data-focused="isFocused('tr') || undefined"
                @click.capture="onPaneClick('tr')"
              >
                <EditorWorkbench
                  :tabs="getPaneGroup('tr')?.tabs.value ?? []"
                  :active-id="getPaneGroup('tr')?.activeTabId.value ?? undefined"
                  @update:active-id="onTabActivate('tr', $event)"
                  @close="onTabClose('tr', $event)"
                  @reorder="onTabReorder('tr', $event)"
                  @contextmenu="onTabContextmenu('tr', $event)"
                >
                  <template #default="{ activeTab }">
                    <slot :pane-id="'tr'" :active-tab="activeTab" :pane="getPaneGroup('tr')!" />
                  </template>
                  <template #empty>
                    <slot name="empty" :pane-id="'tr'" />
                  </template>
                </EditorWorkbench>
              </div>
            </template>
            <template #pane-1>
              <div
                data-rig-pane-group
                data-pane-id="br"
                :data-focused="isFocused('br') || undefined"
                @click.capture="onPaneClick('br')"
              >
                <EditorWorkbench
                  :tabs="getPaneGroup('br')?.tabs.value ?? []"
                  :active-id="getPaneGroup('br')?.activeTabId.value ?? undefined"
                  @update:active-id="onTabActivate('br', $event)"
                  @close="onTabClose('br', $event)"
                  @reorder="onTabReorder('br', $event)"
                  @contextmenu="onTabContextmenu('br', $event)"
                >
                  <template #default="{ activeTab }">
                    <slot :pane-id="'br'" :active-tab="activeTab" :pane="getPaneGroup('br')!" />
                  </template>
                  <template #empty>
                    <slot name="empty" :pane-id="'br'" />
                  </template>
                </EditorWorkbench>
              </div>
            </template>
          </SplitView>

          <!-- Right column: tr only (no br) -->
          <div
            v-else
            data-rig-pane-group
            data-pane-id="tr"
            :data-focused="isFocused('tr') || undefined"
            @click.capture="onPaneClick('tr')"
          >
            <EditorWorkbench
              :tabs="getPaneGroup('tr')?.tabs.value ?? []"
              :active-id="getPaneGroup('tr')?.activeTabId.value ?? undefined"
              @update:active-id="onTabActivate('tr', $event)"
              @close="onTabClose('tr', $event)"
              @reorder="onTabReorder('tr', $event)"
              @contextmenu="onTabContextmenu('tr', $event)"
            >
              <template #default="{ activeTab }">
                <slot :pane-id="'tr'" :active-tab="activeTab" :pane="getPaneGroup('tr')!" />
              </template>
              <template #empty>
                <slot name="empty" :pane-id="'tr'" />
              </template>
            </EditorWorkbench>
          </div>
        </template>
      </SplitView>
    </template>
  </div>
</template>
