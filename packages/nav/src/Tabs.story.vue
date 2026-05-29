<script setup lang="ts">
import Tabs from './Tabs.vue'
import { ref } from 'vue'

const activeTab = ref('overview')
const manualTab = ref('general')
</script>

<template>
  <Story title="Tabs" icon="lucide:panel-top" group="nav">
    <Variant title="Horizontal">
      <Tabs v-model="activeTab">
        <template #tabs="{ isActive, activate }">
          <button
            v-for="tab in ['overview', 'features', 'changelog']"
            :key="tab"
            role="tab"
            :data-tab-id="tab"
            :aria-selected="isActive(tab)"
            :data-state="isActive(tab) ? 'active' : 'inactive'"
            :tabindex="isActive(tab) ? 0 : -1"
            data-rig-tab
            style="
              padding: 6px 12px;
              background: none;
              border: none;
              border-bottom: 2px solid transparent;
              color: var(--foreground);
              cursor: pointer;
            "
            :style="
              isActive(tab) ? { borderBottomColor: 'var(--primary)', color: 'var(--primary)' } : {}
            "
            @click="activate(tab)"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </template>

        <template #default="{ activeId }">
          <div
            style="
              padding: 12px;
              border: 1px solid var(--border);
              border-top: none;
              color: var(--muted-foreground);
            "
          >
            <p v-if="activeId === 'overview'">Overview content for the component.</p>
            <p v-else-if="activeId === 'features'">Feature list and capabilities.</p>
            <p v-else-if="activeId === 'changelog'">Recent changes and updates.</p>
          </div>
        </template>
      </Tabs>
    </Variant>

    <Variant title="Vertical">
      <Tabs v-model="activeTab" orientation="vertical">
        <template #tabs="{ isActive, activate }">
          <button
            v-for="tab in ['general', 'appearance', 'shortcuts']"
            :key="tab"
            role="tab"
            :data-tab-id="tab"
            :aria-selected="isActive(tab)"
            :tabindex="isActive(tab) ? 0 : -1"
            data-rig-tab
            style="
              padding: 6px 12px;
              background: none;
              border: none;
              border-left: 2px solid transparent;
              color: var(--foreground);
              cursor: pointer;
              text-align: left;
            "
            :style="
              isActive(tab) ? { borderLeftColor: 'var(--primary)', color: 'var(--primary)' } : {}
            "
            @click="activate(tab)"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </template>

        <template #default="{ activeId }">
          <div
            style="padding: 12px; border: 1px solid var(--border); color: var(--muted-foreground)"
          >
            <p>{{ activeId }} panel content.</p>
          </div>
        </template>
      </Tabs>
    </Variant>

    <Variant title="Manual Activation">
      <div style="margin-bottom: 8px; font-size: 12px; color: var(--muted-foreground)">
        Arrow keys move focus. Press Enter or Space to activate.
      </div>
      <Tabs v-model="manualTab" activation-mode="manual">
        <template #tabs="{ isActive, activate }">
          <button
            v-for="tab in ['general', 'advanced', 'debug']"
            :key="tab"
            role="tab"
            :data-tab-id="tab"
            :aria-selected="isActive(tab)"
            :data-state="isActive(tab) ? 'active' : 'inactive'"
            :tabindex="isActive(tab) ? 0 : -1"
            data-rig-tab
            style="
              padding: 6px 12px;
              background: none;
              border: none;
              border-bottom: 2px solid transparent;
              color: var(--foreground);
              cursor: pointer;
            "
            :style="
              isActive(tab) ? { borderBottomColor: 'var(--primary)', color: 'var(--primary)' } : {}
            "
            @click="activate(tab)"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </template>

        <template #default="{ activeId }">
          <div
            style="
              padding: 12px;
              border: 1px solid var(--border);
              border-top: none;
              color: var(--muted-foreground);
            "
          >
            <p>Active panel: {{ activeId }}</p>
          </div>
        </template>
      </Tabs>
    </Variant>
  </Story>
</template>
