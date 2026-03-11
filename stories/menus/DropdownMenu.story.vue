<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import DropdownMenu from '@menus/DropdownMenu.vue'
import Button from '@core/primitives/Button.vue'
import type { Action } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const open = ref(false)

const items: Action[] = [
  { id: 'new-file', label: 'New File', keybinding: 'Ctrl+N', icon: 'mdi:file-plus' },
  { id: 'new-folder', label: 'New Folder', icon: 'mdi:folder-plus' },
  { id: 'open', label: 'Open...', keybinding: 'Ctrl+O', icon: 'mdi:folder-open' },
  { id: 'save', label: 'Save', keybinding: 'Ctrl+S', icon: 'mdi:content-save' },
  { id: 'save-as', label: 'Save As...', keybinding: 'Ctrl+Shift+S' },
  { id: 'close', label: 'Close', keybinding: 'Ctrl+W', disabled: true },
]
</script>

<template>
  <Story title="Menus / DropdownMenu" icon="lucide:chevron-down">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px">
        <DropdownMenu v-model:open="open" :items="items">
          <template #trigger="{ toggle }">
            <Button @click="toggle">File Menu</Button>
          </template>
        </DropdownMenu>
      </div>
    </Variant>
  </Story>
</template>
