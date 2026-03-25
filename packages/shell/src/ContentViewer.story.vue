<script setup lang="ts">
import ContentViewer from './ContentViewer.vue'
import { ref } from 'vue'

const breadcrumbs = [
  { id: 'root', label: 'Home' },
  { id: 'docs', label: 'Documents' },
  { id: 'readme', label: 'README.md' },
]

const pgEditable = ref(false)
const pgEditLabel = ref('Edit')
</script>

<template>
  <Story title="ContentViewer" icon="lucide:file-text" group="shell">
    <Variant title="Default">
      <div style="height: 400px; border: 1px solid var(--border)">
        <ContentViewer :breadcrumbs="breadcrumbs">
          <template #header>
            <div style="padding: 16px; font-size: 18px; font-weight: 600; color: var(--foreground)">
              README.md
            </div>
          </template>
          <div style="padding: 16px; color: var(--foreground); font-size: 14px; line-height: 1.6">
            <p>A headless, accessible Vue 3 component library.</p>
            <p style="margin-top: 12px">Provides semantic HTML with data attributes for styling.</p>
          </div>
        </ContentViewer>
      </div>
    </Variant>

    <Variant title="Editable">
      <div style="height: 400px; border: 1px solid var(--border)">
        <ContentViewer :breadcrumbs="breadcrumbs" editable edit-label="Edit File">
          <div style="padding: 16px; color: var(--foreground); font-size: 14px">
            This content can be edited.
          </div>
        </ContentViewer>
      </div>
    </Variant>

    <Variant title="Empty">
      <div style="height: 400px; border: 1px solid var(--border)">
        <ContentViewer />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 400px; border: 1px solid var(--border)">
        <ContentViewer :breadcrumbs="breadcrumbs" :editable="pgEditable" :edit-label="pgEditLabel">
          <div style="padding: 16px; color: var(--foreground); font-size: 14px">
            Playground content area.
          </div>
        </ContentViewer>
      </div>

      <template #controls>
        <HstCheckbox v-model="pgEditable" title="Editable" />
        <HstText v-model="pgEditLabel" title="Edit Label" />
      </template>
    </Variant>
  </Story>
</template>
