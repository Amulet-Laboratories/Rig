<script setup lang="ts">
import ScrollArea from '@layout/ScrollArea.vue'
const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)
</script>

<template>
  <Story title="ScrollArea" icon="lucide:scroll">
        <Variant title="Vertical">
      <div style="padding: 24px">
        <ScrollArea style="height: 200px; border: 1px solid rgba(128,128,128,0.2); border-radius: 4px">
          <div style="padding: 8px">
            <div v-for="item in items" :key="item" style="padding: 4px 0">
              {{ item }}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Variant>

    <Variant title="Horizontal">
      <div style="padding: 24px">
        <ScrollArea horizontal :vertical="false" style="width: 300px; border: 1px solid rgba(128,128,128,0.2); border-radius: 4px">
          <div style="padding: 8px; white-space: nowrap; width: 800px">
            This is a very long content that overflows horizontally and needs a scrollbar to be fully visible.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </div>
        </ScrollArea>
      </div>
    </Variant>
  </Story>
</template>
