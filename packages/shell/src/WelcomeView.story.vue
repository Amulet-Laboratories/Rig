<script setup lang="ts">
import WelcomeView from './WelcomeView.vue'
import { ref } from 'vue'

const stats = [
  { label: 'Components', value: 48 },
  { label: 'Packages', value: 11 },
  { label: 'Tests', value: 312, color: 'var(--success)' },
  { label: 'Coverage', value: '94%' },
]

const pgTitle = ref('Welcome')
const pgDescription = ref('Headless Vue 3 component library')
const pgEmpty = ref(false)
const pgEmptyTitle = ref('No data')
const pgEmptyDescription = ref('Get started by creating your first entry.')
</script>

<template>
  <Story title="WelcomeView" icon="lucide:home" group="shell">
    <Variant title="Default">
      <div style="height: 500px; border: 1px solid var(--border); overflow: auto">
        <WelcomeView
          title="Welcome to Rig"
          description="Headless, accessible Vue 3 component library."
          :stats="stats"
        >
          <div style="padding: 0 16px; display: flex; gap: 12px; flex-wrap: wrap">
            <div
              v-for="pkg in ['core', 'layout', 'nav', 'editor', 'shell']"
              :key="pkg"
              style="
                padding: 12px 16px;
                border: 1px solid var(--border);
                border-radius: 6px;
                color: var(--foreground);
                font-size: 13px;
              "
            >
              {{ pkg }}
            </div>
          </div>

          <template #recent>
            <div style="padding: 16px">
              <h3
                style="font-size: 14px; font-weight: 600; color: var(--foreground); margin: 0 0 8px"
              >
                Recent Files
              </h3>
              <div style="display: flex; flex-direction: column; gap: 4px">
                <div
                  v-for="file in ['Button.vue', 'IdeShell.vue', 'TreeView.vue']"
                  :key="file"
                  style="padding: 6px 10px; color: var(--muted-foreground); font-size: 13px"
                >
                  {{ file }}
                </div>
              </div>
            </div>
          </template>
        </WelcomeView>
      </div>
    </Variant>

    <Variant title="Empty State">
      <div style="height: 400px; border: 1px solid var(--border)">
        <WelcomeView
          title="Dashboard"
          description="Your project overview."
          empty
          empty-title="No data yet"
          empty-description="Create your first entry to get started."
        />
      </div>
    </Variant>

    <Variant title="Stats Only">
      <div style="height: 300px; border: 1px solid var(--border)">
        <WelcomeView title="Overview" :stats="stats" />
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 500px; border: 1px solid var(--border); overflow: auto">
        <WelcomeView
          :title="pgTitle"
          :description="pgDescription"
          :empty="pgEmpty"
          :empty-title="pgEmptyTitle"
          :empty-description="pgEmptyDescription"
          :stats="pgEmpty ? undefined : stats"
        />
      </div>

      <template #controls>
        <HstText v-model="pgTitle" title="Title" />
        <HstText v-model="pgDescription" title="Description" />
        <HstCheckbox v-model="pgEmpty" title="Empty" />
        <HstText v-model="pgEmptyTitle" title="Empty Title" />
        <HstText v-model="pgEmptyDescription" title="Empty Description" />
      </template>
    </Variant>
  </Story>
</template>
