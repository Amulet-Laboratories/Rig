<script setup lang="ts">
import EditorTab from './EditorTab.vue'
</script>

<template>
  <Story title="EditorTab" icon="lucide:file-text" group="editor">
    <Variant title="Default">
      <div
        style="
          display: flex;
          gap: 0;
          background: var(--muted);
          padding: 0;
          border-bottom: 1px solid var(--border);
        "
      >
        <EditorTab
          :tab="{ id: 'main', label: 'main.ts', icon: 'lucide:file-code' }"
          active
          @close="() => {}"
          @activate="() => {}"
        />
        <EditorTab
          :tab="{ id: 'app', label: 'App.vue', icon: 'lucide:file-code' }"
          :active="false"
          @close="() => {}"
          @activate="() => {}"
        />
        <EditorTab
          :tab="{ id: 'style', label: 'style.css', icon: 'lucide:file' }"
          :active="false"
          @close="() => {}"
          @activate="() => {}"
        />
      </div>
    </Variant>

    <Variant title="Single Tab">
      <div style="display: inline-flex; background: var(--muted)">
        <EditorTab
          :tab="{ id: 'readme', label: 'README.md', icon: 'lucide:file-text' }"
          active
          @close="() => {}"
          @activate="() => {}"
        />
      </div>
    </Variant>
  </Story>
</template>
