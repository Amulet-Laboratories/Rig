<script setup lang="ts">
import { ref } from 'vue'
import ContextMenu from '@menus/ContextMenu.vue'
import type { Action } from '@core/types'
const open = ref(false)
const x = ref(0)
const y = ref(0)

const items: Action[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete', disabled: true },
]

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
  x.value = e.clientX
  y.value = e.clientY
  open.value = true
}
</script>

<template>
  <Story title="ContextMenu" icon="lucide:mouse-pointer-click">
        <Variant title="Right-click Area">
      <div
        style="
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed currentColor;
          border-radius: 4px;
        "
        @contextmenu="onContextMenu"
      >
        Right-click here
      </div>
      <ContextMenu
        v-model:open="open"
        :x="x"
        :y="y"
        :items="items"
        @select="(a) => console.log('selected', a.label)"
      />
    </Variant>
  </Story>
</template>
