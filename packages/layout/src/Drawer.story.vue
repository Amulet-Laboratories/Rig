<script setup lang="ts">
import Drawer from './Drawer.vue'
import { ref } from 'vue'

const rightOpen = ref(false)
const leftOpen = ref(false)
const topOpen = ref(false)
const bottomOpen = ref(false)
const persistentOpen = ref(false)
</script>

<template>
  <Story title="Drawer" icon="lucide:panel-right-open" group="layout">
    <Variant title="Right (default)">
      <button @click="rightOpen = true">Open Right Drawer</button>
      <Drawer v-model:open="rightOpen" side="right" aria-label="Right drawer">
        <div style="padding: 16px">
          <h3 style="margin: 0 0 8px">Right Drawer</h3>
          <p style="margin: 0 0 16px; font-size: 14px">This drawer slides in from the right.</p>
          <button @click="rightOpen = false">Close</button>
        </div>
      </Drawer>
    </Variant>

    <Variant title="Left">
      <button @click="leftOpen = true">Open Left Drawer</button>
      <Drawer v-model:open="leftOpen" side="left" aria-label="Left drawer">
        <div style="padding: 16px">
          <h3 style="margin: 0 0 8px">Left Drawer</h3>
          <p style="margin: 0 0 16px; font-size: 14px">This drawer slides in from the left.</p>
          <button @click="leftOpen = false">Close</button>
        </div>
      </Drawer>
    </Variant>

    <Variant title="Top">
      <button @click="topOpen = true">Open Top Drawer</button>
      <Drawer v-model:open="topOpen" side="top" aria-label="Top drawer">
        <div style="padding: 16px">
          <h3 style="margin: 0 0 8px">Top Drawer</h3>
          <p style="margin: 0 0 16px; font-size: 14px">This drawer slides in from the top.</p>
          <button @click="topOpen = false">Close</button>
        </div>
      </Drawer>
    </Variant>

    <Variant title="Bottom">
      <button @click="bottomOpen = true">Open Bottom Drawer</button>
      <Drawer v-model:open="bottomOpen" side="bottom" aria-label="Bottom drawer">
        <div style="padding: 16px">
          <h3 style="margin: 0 0 8px">Bottom Drawer</h3>
          <p style="margin: 0 0 16px; font-size: 14px">This drawer slides in from the bottom.</p>
          <button @click="bottomOpen = false">Close</button>
        </div>
      </Drawer>
    </Variant>

    <Variant title="Persistent">
      <button @click="persistentOpen = true">Open Persistent Drawer</button>
      <Drawer v-model:open="persistentOpen" side="right" persistent aria-label="Persistent drawer">
        <div style="padding: 16px">
          <h3 style="margin: 0 0 8px">Persistent Drawer</h3>
          <p style="margin: 0 0 16px; font-size: 14px">
            Clicking the overlay will not close this drawer. Use the button or press Escape.
          </p>
          <button @click="persistentOpen = false">Close</button>
        </div>
      </Drawer>
    </Variant>
  </Story>
</template>
