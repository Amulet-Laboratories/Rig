<script setup lang="ts">
import TitleBar from './TitleBar.vue'
import { ref } from 'vue'

const title = ref('My Application')
const subtitle = ref('Untitled Document')
const draggable = ref(false)
</script>

<template>
  <Story title="TitleBar" icon="lucide:panel-top" group="layout">
    <Variant title="Default">
      <TitleBar title="My Application" subtitle="Untitled Document" />
    </Variant>

    <Variant title="With Slots">
      <TitleBar title="Editor" subtitle="main.ts">
        <template #leading>
          <div style="display: flex; gap: 6px; align-items: center">
            <span style="font-size: 14px">&#9776;</span>
            <span style="font-size: 12px; opacity: 0.7">File</span>
            <span style="font-size: 12px; opacity: 0.7">Edit</span>
            <span style="font-size: 12px; opacity: 0.7">View</span>
          </div>
        </template>
        <template #trailing>
          <div style="display: flex; gap: 8px; align-items: center">
            <span style="font-size: 14px; cursor: pointer">&#8722;</span>
            <span style="font-size: 14px; cursor: pointer">&#9633;</span>
            <span style="font-size: 14px; cursor: pointer">&#10005;</span>
          </div>
        </template>
      </TitleBar>
    </Variant>

    <Variant title="Playground">
      <TitleBar :title="title" :subtitle="subtitle" :draggable="draggable" />

      <template #controls>
        <HstText v-model="title" title="Title" />
        <HstText v-model="subtitle" title="Subtitle" />
        <HstCheckbox v-model="draggable" title="Draggable" />
      </template>
    </Variant>
  </Story>
</template>
