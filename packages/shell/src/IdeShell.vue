<!--
  IdeShell — Pre-composed VSCode-style IDE layout.

  Wires ShellGrid + ActivityBar + EditorWorkbench + Panel + StatusBar
  together with useShellState, so consumers only need to fill named slots.

  Usage:
  ```vue
  <IdeShell :activities="activities">
    <template #sidebar>…</template>
    <template #editor="{ activeTab }">…</template>
    <template #panel>…</template>
  </IdeShell>
  ```
-->
<script setup lang="ts">
import { ShellGrid, Panel } from '@layout/index'
import { ActivityBar, SideBar, StatusBar, PanelBar } from '@nav/index'
import { EditorWorkbench } from '@editor/index'
import type { Action, TabItem } from '@core/types'
import { useShellState } from './useShellState'
import type { ShellConfig, ShellState } from './types'

const props = withDefaults(
  defineProps<{
    /** Activity bar items */
    activities?: Action[]
    /** Panel bar tabs */
    panelTabs?: TabItem[]
    /** Shell configuration */
    config?: ShellConfig
  }>(),
  {
    activities: () => [],
    panelTabs: () => [],
    config: () => ({}),
  },
)

defineSlots<{
  titlebar?: (props: { shell: ShellState }) => unknown
  activity?: (props: { shell: ShellState }) => unknown
  sidebar?: (props: { shell: ShellState; activity: string }) => unknown
  editor?: (props: { activeTab: TabItem | undefined; shell: ShellState }) => unknown
  'editor-empty'?: (props: { shell: ShellState }) => unknown
  welcome?: (props: { shell: ShellState }) => unknown
  settings?: (props: { shell: ShellState }) => unknown
  panel?: (props: { shell: ShellState; activePanelTab: string }) => unknown
  statusbar?: (props: { shell: ShellState }) => unknown
  aux?: (props: { shell: ShellState }) => unknown
}>()

const shell = useShellState({ ...props.config, provide: true })

function onShellKeydown(e: KeyboardEvent) {
  // Shell-level keyboard shortcuts (Ctrl/Cmd + key)
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'b':
        e.preventDefault()
        shell.sidebarVisible.value = !shell.sidebarVisible.value
        break
      case 'j':
        e.preventDefault()
        shell.panelVisible.value = !shell.panelVisible.value
        break
    }
  }
}

defineExpose({ shell })
</script>

<template>
  <ShellGrid
    data-rig-ide-shell
    aria-label="IDE workspace"
    tabindex="-1"
    :sizes="shell.shellSizes.value"
    @update:sizes="shell.onShellResize"
    @keydown="onShellKeydown"
  >
    <template v-if="$slots.titlebar" #titlebar>
      <slot name="titlebar" :shell="shell" />
    </template>

    <template #activity>
      <slot name="activity" :shell="shell">
        <ActivityBar
          :items="activities"
          :active-id="shell.activeActivity.value"
          @update:active-id="shell.activeActivity.value = $event"
        />
      </slot>
    </template>

    <template #sidebar>
      <SideBar v-show="shell.sidebarVisible.value">
        <slot name="sidebar" :shell="shell" :activity="shell.activeActivity.value" />
      </SideBar>
    </template>

    <template #editor>
      <slot v-if="shell.settingsOpen.value" name="settings" :shell="shell" />
      <EditorWorkbench
        v-else
        :tabs="shell.openTabs.value"
        :active-id="shell.activeTabId.value ?? undefined"
        @update:active-id="shell.activeTabId.value = $event"
        @close="shell.closeTab($event)"
        @reorder="shell.reorderTabs($event)"
      >
        <template #default="{ activeTab }">
          <slot name="editor" :active-tab="activeTab" :shell="shell" />
        </template>
        <template #empty>
          <slot name="welcome" :shell="shell">
            <div data-rig-editor-workbench-empty />
          </slot>
        </template>
      </EditorWorkbench>
    </template>

    <template #panel>
      <slot name="panel" :shell="shell" :active-panel-tab="shell.activePanelTab.value">
        <PanelBar
          v-if="shell.panelVisible.value"
          :tabs="panelTabs"
          :active-id="shell.activePanelTab.value"
          @update:active-id="shell.activePanelTab.value = $event"
        />
      </slot>
    </template>

    <template #statusbar>
      <StatusBar>
        <slot name="statusbar" :shell="shell" />
      </StatusBar>
    </template>
  </ShellGrid>

  <!-- Auxiliary panel (chat, AI, etc.) — rendered outside the main grid -->
  <Panel
    v-if="$slots.aux"
    :open="shell.auxOpen.value"
    position="right"
    :size="shell.auxWidth.value"
    aria-label="Auxiliary panel"
    @update:open="shell.auxOpen.value = $event"
    @update:size="shell.auxWidth.value = $event"
  >
    <slot name="aux" :shell="shell" />
  </Panel>
</template>
