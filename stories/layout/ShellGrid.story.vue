<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import ShellGrid from '@layout/ShellGrid.vue'

const { theme, themeOptions } = useHexTheme()

const sizes = ref({ sideWidth: 260, panelHeight: 200 })
</script>

<template>
  <Story title="Layout / ShellGrid" icon="lucide:layout-grid">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Full Layout">
      <div style="height: 500px">
        <ShellGrid v-model:sizes="sizes" resizable>
          <template #activity>
            <div style="padding: 8px; text-align: center">Act</div>
          </template>
          <template #sidebar>
            <div style="padding: 12px">Sidebar ({{ sizes.sideWidth }}px)</div>
          </template>
          <template #editor>
            <div style="padding: 12px">Editor Area</div>
          </template>
          <template #panel>
            <div style="padding: 12px">Panel ({{ sizes.panelHeight }}px)</div>
          </template>
          <template #statusbar>
            <div style="padding: 2px 8px; font-size: 12px">Status Bar</div>
          </template>
        </ShellGrid>
      </div>
    </Variant>
  </Story>
</template>
