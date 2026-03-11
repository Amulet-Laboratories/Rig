<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import TreeView from '@lists/TreeView.vue'
import type { TreeNode } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const selected = ref<string | string[]>('')
const expanded = ref<string[]>(['src', 'components'])

const nodes: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'mdi:folder',
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'mdi:folder',
        children: [
          { id: 'button', label: 'Button.vue', icon: 'mdi:vuejs' },
          { id: 'input', label: 'Input.vue', icon: 'mdi:vuejs' },
          { id: 'modal', label: 'Modal.vue', icon: 'mdi:vuejs' },
        ],
      },
      {
        id: 'composables',
        label: 'composables',
        icon: 'mdi:folder',
        children: [
          { id: 'useTheme', label: 'useTheme.ts', icon: 'mdi:language-typescript' },
          { id: 'useKeyboard', label: 'useKeyboard.ts', icon: 'mdi:language-typescript' },
        ],
      },
      { id: 'app', label: 'App.vue', icon: 'mdi:vuejs' },
      { id: 'main', label: 'main.ts', icon: 'mdi:language-typescript' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    icon: 'mdi:folder',
    children: [
      { id: 'favicon', label: 'favicon.ico', icon: 'mdi:image' },
    ],
  },
  { id: 'pkg', label: 'package.json', icon: 'mdi:nodejs' },
  { id: 'tsconfig', label: 'tsconfig.json', icon: 'mdi:code-json' },
]
</script>

<template>
  <Story title="Lists / TreeView" icon="lucide:git-branch">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 360px; height: 400px">
        <TreeView
          v-model:selected="selected"
          v-model:expanded="expanded"
          :nodes="nodes"
        />
      </div>
    </Variant>
  </Story>
</template>
