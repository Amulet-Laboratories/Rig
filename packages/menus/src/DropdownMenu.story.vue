<script setup lang="ts">
import DropdownMenu from './DropdownMenu.vue'
import { ref } from 'vue'

const lastAction = ref('')

function onSelect(action: { id: string | number; label?: string }) {
  lastAction.value = `Selected: ${action.label ?? action.id}`
}
</script>

<template>
  <Story title="DropdownMenu" icon="lucide:chevron-down" group="menus">
    <Variant title="Default">
      <div style="padding: 40px">
        <DropdownMenu
          :items="[
            { id: 'new', label: 'New File', icon: 'lucide:file-plus' },
            { id: 'open', label: 'Open', icon: 'lucide:folder-open' },
            { id: 'save', label: 'Save', icon: 'lucide:save' },
            { id: 'export', label: 'Export', icon: 'lucide:download' },
          ]"
          @select="onSelect"
        >
          <template #trigger="{ toggle }">
            <button
              style="
                padding: 8px 16px;
                background: var(--muted);
                color: var(--foreground);
                border: 1px solid var(--border);
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
              "
              @click="toggle"
            >
              File Menu &#9662;
            </button>
          </template>
        </DropdownMenu>
        <div
          v-if="lastAction"
          style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
        >
          {{ lastAction }}
        </div>
      </div>
    </Variant>

    <Variant title="With Disabled Items">
      <div style="padding: 40px">
        <DropdownMenu
          :items="[
            { id: 'undo', label: 'Undo', keybinding: 'Ctrl+Z' },
            { id: 'redo', label: 'Redo', keybinding: 'Ctrl+Y', disabled: true },
            { id: 'cut', label: 'Cut', keybinding: 'Ctrl+X' },
            { id: 'paste', label: 'Paste', keybinding: 'Ctrl+V' },
          ]"
          @select="onSelect"
        >
          <template #trigger="{ toggle }">
            <button
              style="
                padding: 8px 16px;
                background: var(--muted);
                color: var(--foreground);
                border: 1px solid var(--border);
                border-radius: 4px;
                cursor: pointer;
              "
              @click="toggle"
            >
              Edit &#9662;
            </button>
          </template>
        </DropdownMenu>
      </div>
    </Variant>

    <Variant title="Custom Item Slot">
      <div style="padding: 40px">
        <DropdownMenu
          :items="[
            { id: 'profile', label: 'Profile', icon: 'lucide:user' },
            { id: 'settings', label: 'Settings', icon: 'lucide:settings' },
            { id: 'logout', label: 'Log Out', icon: 'lucide:log-out' },
          ]"
          @select="onSelect"
        >
          <template #trigger="{ toggle }">
            <button
              style="
                padding: 8px 16px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="toggle"
            >
              Account &#9662;
            </button>
          </template>
          <template #item="{ item }">
            <div style="display: flex; align-items: center; gap: 8px">
              <span style="font-size: 14px">&#9679;</span>
              <span :style="{ color: item.id === 'logout' ? '#ef4444' : 'inherit' }">{{
                item.label
              }}</span>
            </div>
          </template>
        </DropdownMenu>
      </div>
    </Variant>

    <Variant title="Placement">
      <div style="padding: 80px; display: flex; gap: 16px; justify-content: center">
        <DropdownMenu
          :items="[
            { id: 'opt-1', label: 'Option A' },
            { id: 'opt-2', label: 'Option B' },
            { id: 'opt-3', label: 'Option C' },
          ]"
          placement="bottom-end"
          @select="onSelect"
        >
          <template #trigger="{ toggle }">
            <button
              style="
                padding: 8px 16px;
                background: var(--primary);
                color: var(--primary-foreground);
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "
              @click="toggle"
            >
              Bottom End &#9662;
            </button>
          </template>
        </DropdownMenu>
      </div>
    </Variant>
  </Story>
</template>
