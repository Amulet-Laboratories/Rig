<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick, h, render, markRaw, watch, type Component } from 'vue'

const props = defineProps<{
  /** The component name as it appears in the manifest */
  name: string
  /** The package (core, layout, nav, editor, lists, menus, extras, shell) */
  package: string
  /** component or composable */
  type: 'component' | 'composable'
}>()

const containerRef = ref<HTMLElement | null>(null)
const status = ref<'idle' | 'loading' | 'mounted' | 'error' | 'composable'>('idle')
const errorMsg = ref('')
const resolvedComponent = shallowRef<Component | null>(null)
let vnode: ReturnType<typeof h> | null = null

// Map package names to dynamic imports
const packageImports: Record<string, () => Promise<Record<string, unknown>>> = {
  core: () => import('@core/index'),
  layout: () => import('@layout/index'),
  nav: () => import('@nav/index'),
  editor: () => import('@editor/index'),
  lists: () => import('@lists/index'),
  menus: () => import('@menus/index'),
  extras: () => import('@extras/index'),
  shell: () => import('@shell/index'),
}

// Minimal props to make each component render without errors
const minimalProps: Record<string, Record<string, unknown>> = {
  Button: { as: 'button' },
  IconButton: { label: 'Action' },
  Input: { modelValue: '' },
  Select: { modelValue: '', options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }] },
  Textarea: { modelValue: '' },
  Checkbox: { modelValue: false },
  Switch: { modelValue: false },
  Radio: { modelValue: '' },
  RadioGroup: { modelValue: '' },
  Badge: {},
  Progress: { value: 65, max: 100 },
  InlineEditor: { modelValue: 'Editable text' },
  Resizer: { modelValue: 250 },
  Card: {},
  Divider: {},
  Kbd: {},
  TagInput: { modelValue: ['tag-1', 'tag-2'] },
  Combobox: { modelValue: '', options: [{ value: 'a', label: 'Option A' }] },
  Label: {},
  Toggle: { modelValue: false },
  ToggleGroup: { modelValue: 'a', items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] },
  Slider: { modelValue: 50, min: 0, max: 100 },
  Avatar: { name: 'User' },
  Icon: { name: 'chevron-right' },
  Accordion: { type: 'single', modelValue: 'item-1' },
  Collapsible: { modelValue: true },
  Modal: { modelValue: true },
  Panel: {},
  Popover: {},
  ScrollArea: {},
  ShellGrid: {},
  SplitView: {},
  PeekView: {},
  ActivityBar: { items: [] },
  SideBar: {},
  PanelBar: { tabs: [] },
  StatusBar: { items: [] },
  Breadcrumbs: { items: [{ label: 'Home' }, { label: 'Page' }] },
  Tabs: { modelValue: 'tab-1' },
  View: {},
  EditorWorkbench: { tabs: [] },
  EditorTab: { id: 'tab-1', label: 'File.ts', active: true },
  List: { items: [{ id: '1', label: 'Item 1' }, { id: '2', label: 'Item 2' }] },
  TreeView: { nodes: [{ id: '1', label: 'Root', children: [{ id: '2', label: 'Child' }] }] },
  Table: { columns: [{ key: 'name', label: 'Name' }], data: [{ name: 'Row 1' }] },
  ContextMenu: {},
  CommandPalette: { modelValue: true, commands: [] },
  ActionBar: { actions: [] },
  KeyboardHint: { keys: ['Ctrl', 'S'] },
  DropdownMenu: {},
  Menubar: { entries: [] },
  Toast: {},
  EmptyState: { title: 'Nothing here' },
  Tooltip: {},
  Skeleton: {},
  PropertyGrid: { items: [] },
  NotificationCenter: {},
}

// Slot content for components that need children
const slotContent: Record<string, string> = {
  Button: 'Click me',
  Badge: 'Status',
  Card: 'Card content goes here',
  Kbd: 'Ctrl+K',
  Label: 'Field label',
  Panel: 'Panel content',
  ScrollArea: 'Scrollable content area with some text to demonstrate scrolling behavior.',
  View: 'View content',
  SideBar: 'Sidebar content',
  Tooltip: 'Hover target',
}

async function mountComponent() {
  if (props.type === 'composable') {
    status.value = 'composable'
    return
  }

  status.value = 'loading'
  try {
    const importer = packageImports[props.package]
    if (!importer) {
      throw new Error(`Unknown package: ${props.package}`)
    }

    const mod = await importer()
    const comp = mod[props.name] as Component | undefined
    if (!comp) {
      throw new Error(`${props.name} not exported from @${props.package}`)
    }

    resolvedComponent.value = markRaw(comp)
    await nextTick()

    if (containerRef.value) {
      const componentProps = minimalProps[props.name] ?? {}
      const children = slotContent[props.name]
        ? { default: () => slotContent[props.name] }
        : undefined

      vnode = h(comp, componentProps, children)
      render(vnode, containerRef.value)
      status.value = 'mounted'
    }
  } catch (e: unknown) {
    status.value = 'error'
    errorMsg.value = e instanceof Error ? e.message : String(e)
  }
}

function teardown() {
  if (containerRef.value) {
    render(null, containerRef.value)
  }
  vnode = null
  resolvedComponent.value = null
}

onMounted(() => {
  mountComponent()
})

onBeforeUnmount(() => {
  teardown()
})

// Teardown and remount when component changes
watch(() => props.name, () => {
  teardown()
  status.value = 'idle'
  nextTick(() => mountComponent())
})
</script>

<template>
  <div
    style="
      border-radius: 0.5rem;
      border: 1px solid var(--rig-border, #2a2520);
      background: var(--rig-surface, #1a1815);
      overflow: hidden;
    "
  >
    <!-- Status bar -->
    <div
      style="
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.75rem;
        border-bottom: 1px solid var(--rig-border, #2a2520);
        font-size: 0.6875rem;
      "
    >
      <span
        :style="{
          width: '0.375rem',
          height: '0.375rem',
          borderRadius: '50%',
          background:
            status === 'mounted' ? '#4ade80'
            : status === 'loading' ? '#facc15'
            : status === 'error' ? '#f87171'
            : status === 'composable' ? '#38bdf8'
            : 'rgba(255,255,255,0.2)',
        }"
      />
      <span style="font-weight: 600; opacity: 0.6">
        {{ status === 'mounted' ? 'Live' : status === 'loading' ? 'Loading...' : status === 'error' ? 'Error' : status === 'composable' ? 'Composable' : 'Idle' }}
      </span>
      <span v-if="status === 'mounted'" style="margin-left: auto; opacity: 0.3">
        Rendered with minimal props
      </span>
    </div>

    <!-- Render target -->
    <div
      v-if="status !== 'composable' && status !== 'error'"
      ref="containerRef"
      style="
        padding: 1.5rem;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    />

    <!-- Error state -->
    <div
      v-if="status === 'error'"
      style="
        padding: 1rem;
        font-size: 0.75rem;
        color: #f87171;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
      "
    >
      {{ errorMsg }}
    </div>

    <!-- Composable state -->
    <div
      v-if="status === 'composable'"
      style="
        padding: 1rem;
        font-size: 0.75rem;
        opacity: 0.4;
        text-align: center;
      "
    >
      Composables cannot be visually rendered. See tests and coverage above.
    </div>
  </div>
</template>
