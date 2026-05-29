<script setup lang="ts">
import ScrollArea from './ScrollArea.vue'
</script>

<template>
  <Story title="ScrollArea" icon="lucide:scroll" group="layout">
    <Variant title="Vertical Scroll">
      <ScrollArea style="height: 200px; width: 300px; border: 1px solid var(--border)">
        <div style="padding: 12px; color: var(--foreground)">
          <p v-for="i in 20" :key="i" style="margin: 0 0 8px 0">
            Line item {{ i }} - scrollable content
          </p>
        </div>
      </ScrollArea>
    </Variant>

    <Variant title="Horizontal Scroll">
      <ScrollArea
        horizontal
        :vertical="false"
        style="height: 100px; width: 300px; border: 1px solid var(--border)"
      >
        <div style="padding: 12px; white-space: nowrap; color: var(--foreground)">
          <span v-for="i in 30" :key="i" style="margin-right: 16px">Item {{ i }}</span>
        </div>
      </ScrollArea>
    </Variant>

    <Variant title="Both Axes">
      <ScrollArea
        horizontal
        vertical
        style="height: 200px; width: 300px; border: 1px solid var(--border)"
      >
        <div style="padding: 12px; width: 600px; color: var(--foreground)">
          <p v-for="i in 20" :key="i" style="margin: 0 0 8px 0; white-space: nowrap">
            Wide scrollable line {{ i }} — with extra content that overflows horizontally to
            demonstrate both scroll axes
          </p>
        </div>
      </ScrollArea>
    </Variant>
  </Story>
</template>
