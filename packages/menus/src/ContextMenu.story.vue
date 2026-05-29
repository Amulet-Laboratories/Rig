<script setup lang="ts">
import ContextMenu from './ContextMenu.vue'
import { ref } from 'vue'

const open = ref(false)
const x = ref(0)
const y = ref(0)
const lastAction = ref('')

const items = [
  { id: 'cut', label: 'Cut', icon: 'lucide:scissors', keybinding: 'Ctrl+X' },
  { id: 'copy', label: 'Copy', icon: 'lucide:copy', keybinding: 'Ctrl+C' },
  { id: 'paste', label: 'Paste', icon: 'lucide:clipboard', keybinding: 'Ctrl+V' },
  { id: 'divider', label: '---' },
  { id: 'delete', label: 'Delete', icon: 'lucide:trash-2' },
  { id: 'rename', label: 'Rename', icon: 'lucide:pencil', keybinding: 'F2' },
]

function handleContextMenu(event: MouseEvent) {
  event.preventDefault()
  x.value = event.clientX
  y.value = event.clientY
  open.value = true
}

function onSelect(action: { id: string | number; label?: string }) {
  lastAction.value = `Action: ${action.label ?? action.id}`
  open.value = false
}
</script>

<template>
  <Story title="ContextMenu" icon="lucide:mouse-pointer" group="menus">
    <Variant title="Default">
      <div
        style="
          padding: 40px;
          border: 2px dashed var(--border);
          border-radius: 8px;
          text-align: center;
          color: var(--muted-foreground);
          cursor: context-menu;
        "
        @contextmenu="handleContextMenu"
      >
        Right-click here to open the context menu
      </div>
      <div
        v-if="lastAction"
        style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
      >
        {{ lastAction }}
      </div>
      <ContextMenu v-model:open="open" :x="x" :y="y" :items="items" @select="onSelect" />
    </Variant>

    <Variant title="With Disabled Items">
      <div
        style="
          padding: 40px;
          border: 2px dashed var(--border);
          border-radius: 8px;
          text-align: center;
          color: var(--muted-foreground);
          cursor: context-menu;
        "
        @contextmenu="handleContextMenu"
      >
        Right-click (paste is disabled)
      </div>
      <ContextMenu
        v-model:open="open"
        :x="x"
        :y="y"
        :items="[
          { id: 'cut', label: 'Cut', keybinding: 'Ctrl+X' },
          { id: 'copy', label: 'Copy', keybinding: 'Ctrl+C' },
          { id: 'paste', label: 'Paste', keybinding: 'Ctrl+V', disabled: true },
          { id: 'delete', label: 'Delete' },
        ]"
        @select="onSelect"
      />
    </Variant>

    <Variant title="Custom Item Slot">
      <div
        style="
          padding: 40px;
          border: 2px dashed var(--border);
          border-radius: 8px;
          text-align: center;
          color: var(--muted-foreground);
          cursor: context-menu;
        "
        @contextmenu="handleContextMenu"
      >
        Right-click for custom rendering
      </div>
      <ContextMenu v-model:open="open" :x="x" :y="y" :items="items" @select="onSelect">
        <template #item="{ item }">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              width: 100%;
              justify-content: space-between;
            "
          >
            <span :style="{ color: item.id === 'delete' ? '#ef4444' : 'inherit' }">{{
              item.label
            }}</span>
            <span
              v-if="item.keybinding"
              style="font-size: 10px; color: var(--muted-foreground); font-family: monospace"
            >
              {{ item.keybinding }}
            </span>
          </div>
        </template>
      </ContextMenu>
    </Variant>
  </Story>
</template>
