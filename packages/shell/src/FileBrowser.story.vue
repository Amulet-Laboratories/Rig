<script setup lang="ts">
import FileBrowser from './FileBrowser.vue'
import { ref } from 'vue'

const groups = [
  {
    id: 'src',
    label: 'SRC',
    nodes: [
      {
        id: 'components',
        label: 'components',
        icon: 'lucide:folder',
        children: [
          { id: 'button', label: 'Button.vue', icon: 'lucide:file' },
          { id: 'input', label: 'Input.vue', icon: 'lucide:file' },
          { id: 'select', label: 'Select.vue', icon: 'lucide:file' },
        ],
      },
      { id: 'index', label: 'index.ts', icon: 'lucide:file' },
      { id: 'app', label: 'App.vue', icon: 'lucide:file' },
    ],
  },
  {
    id: 'config',
    label: 'CONFIG',
    nodes: [
      { id: 'vite', label: 'vite.config.ts', icon: 'lucide:file' },
      { id: 'tsconfig', label: 'tsconfig.json', icon: 'lucide:file' },
      { id: 'package', label: 'package.json', icon: 'lucide:file' },
    ],
  },
]

const selected = ref<string | undefined>('button')
const expanded = ref<string[]>(['components'])
const collapsedGroups = ref<string[]>([])

const pgTitle = ref('Explorer')
const pgAccent = ref('')
</script>

<template>
  <Story title="FileBrowser" icon="lucide:folder" group="shell">
    <Variant title="Default">
      <div style="height: 400px; width: 260px; border: 1px solid var(--border)">
        <FileBrowser :groups="groups" :selected="selected" :expanded="expanded" title="Explorer" />
      </div>
    </Variant>

    <Variant title="With Collapsed Group">
      <div style="height: 400px; width: 260px; border: 1px solid var(--border)">
        <FileBrowser
          :groups="groups"
          :selected="selected"
          :expanded="expanded"
          :collapsed-groups="['config']"
          title="Explorer"
        />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 400px; width: 260px; border: 1px solid var(--border)">
        <FileBrowser
          :groups="groups"
          :selected="selected"
          :expanded="expanded"
          :collapsed-groups="collapsedGroups"
          :title="pgTitle"
          :accent="pgAccent || undefined"
          @select="selected = $event"
          @update:expanded="expanded = $event"
          @update:collapsed-groups="collapsedGroups = $event"
        />
      </div>

      <template #controls>
        <HstText v-model="pgTitle" title="Title" />
        <HstText v-model="pgAccent" title="Accent Color" />
      </template>
    </Variant>
  </Story>
</template>
