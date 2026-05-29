<!--
  FileBrowser — Generic file/item browser sidebar for IdeShell.
  Renders collapsible View groups with TreeView nodes inside.
-->
<script setup lang="ts">
import { View } from '@nav/index'
import { TreeView } from '@lists/index'
import type { ID, TreeNode } from '@core/types'

defineProps<{
  /** Groups of tree nodes, each becoming a collapsible View section */
  groups: { id: string; label: string; nodes: TreeNode[] }[]
  /** Currently selected node ID */
  selected?: ID
  /** Currently expanded node IDs */
  expanded?: ID[]
  /** Group IDs that are currently collapsed */
  collapsedGroups?: string[]
  /** Title shown in the sidebar header */
  title?: string
  /** Optional accent color for header */
  accent?: string
}>()

const emit = defineEmits<{
  select: [id: ID]
  activate: [node: TreeNode]
  'update:expanded': [ids: ID[]]
  'update:collapsedGroups': [ids: string[]]
  contextmenu: [payload: { node: TreeNode; event: MouseEvent }]
}>()

defineSlots<{
  /** Sidebar header content */
  header?: (props: Record<string, never>) => unknown
  /** Custom tree node rendering */
  node?: (props: { node: TreeNode }) => unknown
}>()

function onSelect(id: ID | ID[]) {
  const selected = Array.isArray(id) ? id[0] : id
  if (selected != null) emit('select', selected)
}

function isCollapsed(groupId: string, collapsedGroups?: string[]): boolean {
  return collapsedGroups?.includes(groupId) ?? false
}

function toggleGroup(groupId: string, collapsedGroups?: string[]) {
  const current = collapsedGroups ?? []
  if (current.includes(groupId)) {
    emit(
      'update:collapsedGroups',
      current.filter((id) => id !== groupId),
    )
  } else {
    emit('update:collapsedGroups', [...current, groupId])
  }
}
</script>

<template>
  <div data-rig-file-browser>
    <div data-rig-sidebar-header :style="accent ? { color: accent } : undefined">
      <slot name="header">
        <span>{{ title }}</span>
      </slot>
    </div>

    <div data-rig-file-browser-content>
      <View
        v-for="group in groups"
        :key="group.id"
        :title="group.label"
        :collapsed="isCollapsed(group.id, collapsedGroups)"
        @update:collapsed="toggleGroup(group.id, collapsedGroups)"
      >
        <TreeView
          :nodes="group.nodes"
          :selected="selected"
          :expanded="expanded"
          @update:selected="onSelect"
          @update:expanded="emit('update:expanded', $event)"
          @activate="emit('activate', $event)"
          @contextmenu="emit('contextmenu', $event)"
        >
          <template v-if="$slots.node" #node="{ node }">
            <slot name="node" :node="node" />
          </template>
        </TreeView>
      </View>
    </div>
  </div>
</template>
