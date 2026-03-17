<script setup lang="ts">
import Breadcrumbs from './Breadcrumbs.vue'
import { ref } from 'vue'

const pgSeparator = ref('/')
const lastBreadcrumb = ref('')

function onSelect(id: string) {
  lastBreadcrumb.value = `Navigated to: ${id}`
}
</script>

<template>
  <Story title="Breadcrumbs" icon="lucide:chevron-right" group="nav">
    <Variant title="Default">
      <Breadcrumbs
        :items="[
          { id: 'home', label: 'Home' },
          { id: 'docs', label: 'Documentation' },
          { id: 'components', label: 'Components' },
          { id: 'button', label: 'Button' },
        ]"
        @select="onSelect"
      />
      <div
        v-if="lastBreadcrumb"
        style="margin-top: 8px; font-size: 12px; color: var(--muted-foreground)"
      >
        {{ lastBreadcrumb }}
      </div>
    </Variant>

    <Variant title="Custom Separator">
      <Breadcrumbs
        :items="[
          { id: 'src', label: 'src' },
          { id: 'components', label: 'components' },
          { id: 'ui', label: 'ui' },
        ]"
        separator=">"
        @select="onSelect"
      />
    </Variant>

    <Variant title="Two Items">
      <Breadcrumbs
        :items="[
          { id: 'root', label: 'Root' },
          { id: 'current', label: 'Current Page' },
        ]"
        @select="onSelect"
      />
    </Variant>

    <Variant title="Playground">
      <Breadcrumbs
        :items="[
          { id: 'home', label: 'Home' },
          { id: 'docs', label: 'Documentation' },
          { id: 'components', label: 'Components' },
          { id: 'button', label: 'Button' },
        ]"
        :separator="pgSeparator"
        @select="onSelect"
      />

      <template #controls>
        <HstText v-model="pgSeparator" title="Separator" />
      </template>
    </Variant>
  </Story>
</template>
