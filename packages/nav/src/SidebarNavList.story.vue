<script setup lang="ts">
import SidebarNavList from './SidebarNavList.vue'
import { ref } from 'vue'

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'budget', label: 'Budget', icon: '💰' },
  { id: 'transactions', label: 'Transactions', icon: '📝' },
  { id: 'reports', label: 'Reports', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const activeId = ref('dashboard')

function onSelect(item: { id: string }) {
  activeId.value = item.id
}
</script>

<template>
  <Story title="SidebarNavList" icon="lucide:list" group="nav">
    <Variant title="Default">
      <div style="width: 240px; background: var(--color-background, #1e1e1e); padding: 8px 0">
        <SidebarNavList :items="items" :active-id="activeId" @select="onSelect" />
      </div>
    </Variant>

    <Variant title="No Icons">
      <div style="width: 240px; background: var(--color-background, #1e1e1e); padding: 8px 0">
        <SidebarNavList
          :items="items.map((i) => ({ id: i.id, label: i.label }))"
          :active-id="activeId"
          @select="onSelect"
        />
      </div>
    </Variant>
  </Story>
</template>
