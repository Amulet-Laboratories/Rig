<script setup lang="ts">
import { ref } from 'vue'
import SideBar from '@nav/SideBar.vue'
const open = ref(true)
const width = ref(260)
</script>

<template>
  <Story title="SideBar" icon="lucide:panel-left">
    <template #controls>
      <HstCheckbox v-model="open" title="Open" />
      <HstSlider v-model="width" title="Width" :min="180" :max="400" />
    </template>

    <Variant title="Default">
      <div style="display: flex; height: 400px">
        <SideBar v-model:open="open" :width="width">
          <template #header>
            <div style="padding: 8px; font-weight: bold">Explorer</div>
          </template>
          <div style="padding: 8px">Sidebar content goes here</div>
        </SideBar>
        <div style="flex: 1; padding: 12px">Main content area</div>
      </div>
    </Variant>
  </Story>
</template>
