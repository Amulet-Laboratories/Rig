<script setup lang="ts">
import CommandPalette from './CommandPalette.vue'
import { ref } from 'vue'

const open = ref(false)
const asyncOpen = ref(false)
const slotOpen = ref(false)

const items = [
  { id: 'new-file', label: 'New File', icon: 'lucide:file-plus', description: 'Create a new file' },
  {
    id: 'open-file',
    label: 'Open File',
    icon: 'lucide:folder-open',
    description: 'Open an existing file',
  },
  { id: 'save', label: 'Save', icon: 'lucide:save', description: 'Save current file' },
  {
    id: 'settings',
    label: 'Open Settings',
    icon: 'lucide:settings',
    description: 'Application preferences',
  },
  { id: 'theme', label: 'Color Theme', icon: 'lucide:palette', description: 'Change color theme' },
  {
    id: 'terminal',
    label: 'Toggle Terminal',
    icon: 'lucide:terminal',
    description: 'Show/hide terminal',
  },
  {
    id: 'git',
    label: 'Git: Commit',
    icon: 'lucide:git-commit',
    description: 'Commit staged changes',
  },
  {
    id: 'search',
    label: 'Search Files',
    icon: 'lucide:search',
    description: 'Search across workspace',
  },
]

const lastAction = ref('')

function onSelect(item: { id: string; label: string }) {
  lastAction.value = `Executed: ${item.label}`
}

// Async mode: simulate server search
async function asyncItemsFn(query: string) {
  await new Promise((r) => setTimeout(r, 400))
  const allCommands = [
    { id: 'fmt', label: 'Format Document', description: 'Auto-format the file' },
    { id: 'lint', label: 'Run Linter', description: 'Check for lint errors' },
    { id: 'build', label: 'Build Project', description: 'Compile the project' },
    { id: 'test', label: 'Run Tests', description: 'Execute test suite' },
    { id: 'deploy', label: 'Deploy', description: 'Deploy to production' },
    { id: 'install', label: 'Install Dependencies', description: 'pnpm install' },
  ]
  if (!query) return allCommands
  const q = query.toLowerCase()
  return allCommands.filter(
    (c) => c.label.toLowerCase().includes(q) || (c.description?.toLowerCase().includes(q) ?? false),
  )
}
</script>

<template>
  <Story title="CommandPalette" icon="lucide:command" group="menus">
    <Variant title="Default">
      <div>
        <button
          style="
            padding: 8px 16px;
            background: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
          @click="open = true"
        >
          Open Command Palette
        </button>
        <div
          v-if="lastAction"
          style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
        >
          {{ lastAction }}
        </div>
      </div>
      <CommandPalette
        v-model:open="open"
        :items="items"
        placeholder="Type a command..."
        @select="onSelect"
      />
    </Variant>

    <Variant title="Async Items">
      <div>
        <button
          style="
            padding: 8px 16px;
            background: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
          @click="asyncOpen = true"
        >
          Open Async Palette
        </button>
        <div style="margin-top: 8px; font-size: 11px; color: var(--muted-foreground)">
          Items are fetched via an async function with a 400ms delay.
        </div>
      </div>
      <CommandPalette
        v-model:open="asyncOpen"
        :items="asyncItemsFn"
        placeholder="Search commands..."
        @select="onSelect"
      />
    </Variant>

    <Variant title="Custom Item & Empty Slots">
      <div>
        <button
          style="
            padding: 8px 16px;
            background: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
          "
          @click="slotOpen = true"
        >
          Open Custom Palette
        </button>
      </div>
      <CommandPalette
        v-model:open="slotOpen"
        :items="items"
        placeholder="Custom rendering..."
        @select="onSelect"
      >
        <template #item="{ item, highlighted }">
          <div style="display: flex; align-items: center; gap: 8px; width: 100%">
            <span
              style="width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0"
              :style="{ background: highlighted ? 'var(--primary)' : 'var(--muted-foreground)' }"
            />
            <div>
              <div :style="{ fontWeight: highlighted ? '600' : '400' }">{{ item.label }}</div>
              <div v-if="item.description" style="font-size: 11px; color: var(--muted-foreground)">
                {{ item.description }}
              </div>
            </div>
          </div>
        </template>

        <template #empty>
          <div
            style="
              text-align: center;
              padding: 16px;
              color: var(--muted-foreground);
              font-size: 13px;
            "
          >
            No commands match your query.
          </div>
        </template>
      </CommandPalette>
    </Variant>
  </Story>
</template>
