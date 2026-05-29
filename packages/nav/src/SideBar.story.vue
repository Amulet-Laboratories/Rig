<script setup lang="ts">
import SideBar from './SideBar.vue'
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <Story title="SideBar" icon="lucide:panel-left" group="nav">
    <Variant title="Default">
      <div style="display: flex; height: 300px; border: 1px solid var(--border)">
        <SideBar v-model:open="open">
          <template #header>
            <div
              style="
                padding: 8px 12px;
                font-weight: 600;
                color: var(--foreground);
                text-transform: uppercase;
                font-size: 11px;
              "
            >
              Explorer
            </div>
          </template>
          <div style="padding: 8px 12px; color: var(--muted-foreground); font-size: 13px">
            <div
              v-for="item in ['src/', 'public/', 'package.json', 'tsconfig.json', 'vite.config.ts']"
              :key="item"
              style="padding: 4px 0"
            >
              {{ item }}
            </div>
          </div>
        </SideBar>
        <div style="flex: 1; padding: 12px; color: var(--foreground)">Main content</div>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="display: flex; height: 300px; border: 1px solid var(--border)">
        <SideBar v-model:open="open">
          <div style="padding: 12px; color: var(--muted-foreground)">Sidebar content</div>
        </SideBar>
        <div style="flex: 1; padding: 12px; color: var(--foreground)">
          <button
            style="
              padding: 4px 8px;
              background: var(--muted);
              border: 1px solid var(--border);
              border-radius: 4px;
              color: var(--foreground);
              cursor: pointer;
            "
            @click="open = !open"
          >
            Toggle Sidebar
          </button>
        </div>
      </div>

      <template #controls>
        <HstCheckbox v-model="open" title="Open" />
      </template>
    </Variant>
  </Story>
</template>
