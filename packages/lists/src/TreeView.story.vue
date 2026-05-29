<script setup lang="ts">
import TreeView from './TreeView.vue'
import { ref } from 'vue'

const selected = ref<string>('src')
const expanded = ref<string[]>(['root', 'src'])

const nodes = [
  {
    id: 'root',
    label: 'my-project',
    icon: 'lucide:folder',
    children: [
      {
        id: 'src',
        label: 'src',
        icon: 'lucide:folder',
        children: [
          { id: 'main', label: 'main.ts', icon: 'lucide:file-code' },
          { id: 'app', label: 'App.vue', icon: 'lucide:file-code' },
          {
            id: 'components',
            label: 'components',
            icon: 'lucide:folder',
            children: [
              { id: 'button', label: 'Button.vue', icon: 'lucide:file-code' },
              { id: 'input', label: 'Input.vue', icon: 'lucide:file-code' },
            ],
          },
        ],
      },
      { id: 'pkg', label: 'package.json', icon: 'lucide:file' },
      { id: 'tsconfig', label: 'tsconfig.json', icon: 'lucide:file' },
      { id: 'readme', label: 'README.md', icon: 'lucide:file-text' },
    ],
  },
]

// Lazy-load nodes (simulates async fetch)
const lazyNodes = [
  { id: 'server', label: 'server' },
  { id: 'client', label: 'client' },
  { id: 'shared', label: 'shared' },
]
const lazyExpanded = ref<string[]>([])

async function loadChildren(node: { id: string }) {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800))
  if (node.id === 'server') {
    return [
      { id: 's-routes', label: 'routes.ts' },
      { id: 's-middleware', label: 'middleware.ts' },
    ]
  }
  if (node.id === 'client') {
    return [
      { id: 'c-app', label: 'App.vue' },
      { id: 'c-main', label: 'main.ts' },
    ]
  }
  return [{ id: `${node.id}-empty`, label: 'index.ts' }]
}

// Virtual scroll — large tree
const bigNodes = Array.from({ length: 200 }, (_, i) => ({
  id: `item-${i}`,
  label: `Item ${i + 1}`,
}))
const bigSelected = ref<string>('item-0')

// Emit tracking
const lastActivated = ref('')
const lastContextMenu = ref('')

function onActivate(node: { id: string; label: string }) {
  lastActivated.value = `Activated: ${node.label}`
}

function onContextMenu({ node }: { node: { id: string; label: string } }) {
  lastContextMenu.value = `Context menu: ${node.label}`
}
</script>

<template>
  <Story title="TreeView" icon="lucide:folder-tree" group="lists">
    <Variant title="Default">
      <div style="width: 280px; border: 1px solid var(--border)">
        <TreeView
          v-model:selected="selected"
          v-model:expanded="expanded"
          :nodes="nodes"
          @activate="onActivate"
          @contextmenu="onContextMenu"
        />
      </div>
      <div style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)">
        Selected: {{ selected }}
        <span v-if="lastActivated"> | {{ lastActivated }}</span>
        <span v-if="lastContextMenu"> | {{ lastContextMenu }}</span>
      </div>
    </Variant>

    <Variant title="Multi Select">
      <div style="width: 280px; border: 1px solid var(--border)">
        <TreeView
          v-model:expanded="expanded"
          :selected="['main', 'app']"
          :nodes="nodes"
          multi-select
        />
      </div>
    </Variant>

    <Variant title="Async Lazy Load (onExpand)">
      <div style="width: 280px; border: 1px solid var(--border)">
        <TreeView v-model:expanded="lazyExpanded" :nodes="lazyNodes" :on-expand="loadChildren" />
      </div>
      <div style="margin-top: 8px; font-size: 11px; color: var(--muted-foreground)">
        Click a folder to lazy-load children (800ms delay).
      </div>
    </Variant>

    <Variant title="Virtual Scroll (200 items)">
      <div style="width: 280px; height: 300px; border: 1px solid var(--border); overflow: auto">
        <TreeView v-model:selected="bigSelected" :nodes="bigNodes" virtual :item-height="22" />
      </div>
    </Variant>

    <Variant title="Custom Node Slot">
      <div style="width: 320px; border: 1px solid var(--border)">
        <TreeView v-model:selected="selected" v-model:expanded="expanded" :nodes="nodes">
          <template #node="{ node, depth, expanded: isExpanded, selected: isSelected }">
            <span style="display: inline-flex; align-items: center; gap: 4px">
              <span v-if="node.children" style="font-size: 12px">{{
                isExpanded ? '&#128194;' : '&#128193;'
              }}</span>
              <span v-else style="font-size: 12px">&#128196;</span>
              <span
                :style="{
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? 'var(--primary)' : 'inherit',
                }"
              >
                {{ node.label }}
              </span>
              <span
                v-if="depth === 0"
                style="font-size: 10px; color: var(--muted-foreground); margin-left: 4px"
              >
                (root)
              </span>
            </span>
          </template>
        </TreeView>
      </div>
    </Variant>

    <Variant title="Flat List">
      <div style="width: 280px; border: 1px solid var(--border)">
        <TreeView
          v-model:selected="selected"
          :nodes="[
            { id: '1', label: 'Item one' },
            { id: '2', label: 'Item two' },
            { id: '3', label: 'Item three' },
            { id: '4', label: 'Item four' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
