<script setup lang="ts" generic="T">
import { ref, computed, shallowRef, watch, nextTick } from 'vue'
import type { TreeNode, ID } from '@core/types'
import { useVirtualList } from '@core/composables'

const props = withDefaults(
  defineProps<{
    /** Root tree nodes */
    nodes: TreeNode<T>[]
    /** Currently selected node ID(s) */
    selected?: ID | ID[]
    /** Enable multi-select */
    multiSelect?: boolean
    /** Currently expanded node IDs */
    expanded?: ID[]
    /** Async function to load children on expand */
    onExpand?: (node: TreeNode<T>) => Promise<TreeNode<T>[]>
    /** Enable virtual / windowed rendering for large trees */
    virtual?: boolean
    /** Row height per node in px — used for virtual scroll calculations */
    itemHeight?: number
  }>(),
  {
    multiSelect: false,
    expanded: () => [],
    virtual: false,
    itemHeight: 22,
  },
)

const emit = defineEmits<{
  'update:selected': [value: ID | ID[]]
  'update:expanded': [value: ID[]]
  activate: [node: TreeNode<T>]
  contextmenu: [payload: { node: TreeNode<T>; event: MouseEvent }]
  rename: [payload: { node: TreeNode<T>; newLabel: string }]
}>()

defineSlots<{
  node: (props: {
    node: TreeNode<T>
    depth: number
    expanded: boolean
    selected: boolean
    toggle: () => void
  }) => unknown
}>()

const focusedIndex = ref(0)
const itemRefs = ref<HTMLElement[]>([])
const loadingNodes = ref<Set<ID>>(new Set())
const loadedChildren = shallowRef(new Map<ID, TreeNode<T>[]>())

function setItemRef(el: unknown, index: number) {
  if (el instanceof HTMLElement) {
    itemRefs.value[index] = el
  }
}

// Flatten tree into visible nodes list
interface FlatNode {
  node: TreeNode<T>
  depth: number
  isLeaf: boolean
  /** Number of siblings at this level (for aria-setsize) */
  setSize: number
  /** 1-based position among siblings (for aria-posinset) */
  posInSet: number
}

function flatten(nodes: TreeNode<T>[], depth: number, expandedSet: Set<ID>): FlatNode[] {
  const result: FlatNode[] = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]!
    const resolvedChildren = loadedChildren.value.get(node.id) ?? node.children
    const hasChildren = resolvedChildren && resolvedChildren.length > 0
    const isExpandable = hasChildren || (!!props.onExpand && node.children === undefined)
    const isLeaf = !isExpandable
    result.push({ node, depth, isLeaf, setSize: nodes.length, posInSet: i + 1 })
    if (!isLeaf && expandedSet.has(node.id) && resolvedChildren) {
      result.push(...flatten(resolvedChildren, depth + 1, expandedSet))
    }
  }
  return result
}

const expandedSet = computed(() => new Set(props.expanded))

const visibleNodes = computed(() => flatten(props.nodes, 0, expandedSet.value))

// Virtual scroll — pass empty array when virtual=false to disable windowing
const { containerRef, virtualState, onScroll } = useVirtualList(
  () => (props.virtual ? visibleNodes.value : []),
  { itemHeight: props.itemHeight! },
)

const renderedNodes = computed(() =>
  props.virtual
    ? virtualState.value.items.map(({ item, index }) => ({ item, index }))
    : visibleNodes.value.map((item, index) => ({ item, index })),
)

const paddingTop = computed(() => (props.virtual ? virtualState.value.paddingTop : 0))
const paddingBottom = computed(() => (props.virtual ? virtualState.value.paddingBottom : 0))

// In virtual mode, scroll the focused row into view then hand focus to it
watch(focusedIndex, async (idx) => {
  if (!props.virtual || !containerRef.value) return
  const top = idx * props.itemHeight!
  const bottom = top + props.itemHeight!
  const el = containerRef.value
  if (top < el.scrollTop) {
    el.scrollTop = top
  } else if (bottom > el.scrollTop + el.clientHeight) {
    el.scrollTop = bottom - el.clientHeight
  }
  await nextTick()
  itemRefs.value[idx]?.focus()
})

function isSelected(id: ID): boolean {
  if (Array.isArray(props.selected)) return props.selected.includes(id)
  return props.selected === id
}

function isExpanded(id: ID): boolean {
  return expandedSet.value.has(id)
}

function select(node: TreeNode<T>) {
  if (props.multiSelect && Array.isArray(props.selected)) {
    const current = [...props.selected]
    const idx = current.indexOf(node.id)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(node.id)
    emit('update:selected', current)
  } else {
    emit('update:selected', node.id)
  }
}

async function toggleExpand(node: TreeNode<T>) {
  const current = [...(props.expanded ?? [])]

  if (isExpanded(node.id)) {
    emit(
      'update:expanded',
      current.filter((id) => id !== node.id),
    )
  } else {
    // Lazy load — store results in internal map to avoid mutating props
    if (
      props.onExpand &&
      (!node.children || node.children.length === 0) &&
      !loadedChildren.value.has(node.id)
    ) {
      loadingNodes.value.add(node.id)
      try {
        const children = await props.onExpand(node)
        const next = new Map(loadedChildren.value)
        next.set(node.id, children)
        loadedChildren.value = next
      } finally {
        loadingNodes.value.delete(node.id)
      }
    }
    current.push(node.id)
    emit('update:expanded', current)
  }
}

function onKeydown(e: KeyboardEvent) {
  const flat = visibleNodes.value
  const current = flat[focusedIndex.value]
  if (!current) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, flat.length - 1)
      itemRefs.value[focusedIndex.value]?.focus()
      break
    case 'ArrowUp':
      e.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      itemRefs.value[focusedIndex.value]?.focus()
      break
    case 'ArrowRight':
      e.preventDefault()
      if (!current.isLeaf && !isExpanded(current.node.id)) {
        toggleExpand(current.node)
      } else if (!current.isLeaf && isExpanded(current.node.id)) {
        // Move to first child
        if (focusedIndex.value + 1 < flat.length) {
          focusedIndex.value++
          itemRefs.value[focusedIndex.value]?.focus()
        }
      }
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (!current.isLeaf && isExpanded(current.node.id)) {
        toggleExpand(current.node)
      } else if (current.depth > 0) {
        // Move to parent
        for (let i = focusedIndex.value - 1; i >= 0; i--) {
          if (flat[i]!.depth < current.depth) {
            focusedIndex.value = i
            itemRefs.value[i]?.focus()
            break
          }
        }
      }
      break
    case 'Home':
      e.preventDefault()
      focusedIndex.value = 0
      itemRefs.value[0]?.focus()
      break
    case 'End':
      e.preventDefault()
      focusedIndex.value = flat.length - 1
      itemRefs.value[focusedIndex.value]?.focus()
      break
    case 'Enter':
      e.preventDefault()
      emit('activate', current.node)
      break
    case ' ':
      e.preventDefault()
      select(current.node)
      break
  }
}
</script>

<template>
  <div
    ref="containerRef"
    data-rig-tree
    role="tree"
    :data-virtual="virtual || undefined"
    @keydown="onKeydown"
    @scroll="virtual ? onScroll() : undefined"
  >
    <div :style="{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }">
      <div
        v-for="{ item: flat, index } in renderedNodes"
        :key="flat.node.id"
        :ref="(el) => setItemRef(el, index)"
        data-rig-tree-node
        role="treeitem"
        :aria-level="flat.depth + 1"
        :aria-expanded="flat.isLeaf ? undefined : isExpanded(flat.node.id)"
        :aria-selected="isSelected(flat.node.id)"
        :aria-setsize="flat.setSize"
        :aria-posinset="flat.posInSet"
        :data-state="isExpanded(flat.node.id) ? 'open' : 'closed'"
        :data-selected="isSelected(flat.node.id) || undefined"
        :data-depth="flat.depth"
        :data-leaf="flat.isLeaf || undefined"
        :data-loading="loadingNodes.has(flat.node.id) || undefined"
        :tabindex="index === focusedIndex ? 0 : -1"
        @click.stop="select(flat.node)"
        @dblclick.stop="!flat.isLeaf ? toggleExpand(flat.node) : emit('activate', flat.node)"
        @contextmenu.prevent="emit('contextmenu', { node: flat.node, event: $event })"
      >
        <!-- Indent guides -->
        <span v-if="flat.depth > 0" data-rig-tree-indent aria-hidden="true">
          <span v-for="level in flat.depth" :key="level" data-rig-tree-indent-guide />
        </span>
        <button
          v-if="!flat.isLeaf"
          data-rig-tree-toggle
          tabindex="-1"
          :data-state="isExpanded(flat.node.id) ? 'open' : 'closed'"
          :aria-label="isExpanded(flat.node.id) ? 'Collapse' : 'Expand'"
          @click.stop="toggleExpand(flat.node)"
        />
        <slot
          name="node"
          :node="flat.node"
          :depth="flat.depth"
          :expanded="isExpanded(flat.node.id)"
          :selected="isSelected(flat.node.id)"
          :toggle="() => toggleExpand(flat.node)"
        >
          <span data-rig-tree-node-label>{{ flat.node.label }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>
