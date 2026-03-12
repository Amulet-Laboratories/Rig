<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '@nav/Tabs.vue'
const activeTab = ref('overview')
const orientation = ref<'horizontal' | 'vertical'>('horizontal')

const tabs = ['overview', 'settings', 'permissions', 'logs']
</script>

<template>
  <Story title="Tabs" icon="lucide:layout-grid">
    <template #controls>
      <HstSelect v-model="orientation" title="Orientation" :options="['horizontal', 'vertical']" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 500px">
        <Tabs v-model="activeTab" :orientation="orientation">
          <template #tabs="{ isActive, activate }">
            <button
              v-for="tab in tabs"
              :key="tab"
              :data-active="isActive(tab) || undefined"
              style="padding: 8px 16px; text-transform: capitalize; cursor: pointer"
              @click="activate(tab)"
            >
              {{ tab }}
            </button>
          </template>
          <template #default="{ activeId }">
            <div style="padding: 16px">
              Content for <strong>{{ activeId }}</strong> tab
            </div>
          </template>
        </Tabs>
      </div>
    </Variant>
  </Story>
</template>
