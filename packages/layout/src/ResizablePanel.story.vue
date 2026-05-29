<script setup lang="ts">
import ResizablePanel from './ResizablePanel.vue'
import { ref } from 'vue'

const direction = ref<'horizontal' | 'vertical'>('horizontal')
</script>

<template>
  <Story title="ResizablePanel" icon="lucide:move-horizontal" group="layout">
    <Variant title="Horizontal">
      <div style="display: flex; height: 200px; border: 1px solid var(--border)">
        <ResizablePanel direction="horizontal" :initial-size="250">
          <div style="padding: 12px; color: var(--foreground); height: 100%">
            Resizable panel (drag the edge)
          </div>
        </ResizablePanel>
        <div style="flex: 1; padding: 12px; color: var(--muted-foreground)">Main content</div>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div
        style="
          display: flex;
          flex-direction: column;
          height: 300px;
          border: 1px solid var(--border);
        "
      >
        <ResizablePanel direction="vertical" :initial-size="120">
          <div style="padding: 12px; color: var(--foreground); height: 100%">Top panel</div>
        </ResizablePanel>
        <div style="flex: 1; padding: 12px; color: var(--muted-foreground)">Bottom content</div>
      </div>
    </Variant>

    <Variant title="Playground">
      <div
        :style="{
          display: 'flex',
          flexDirection: direction === 'vertical' ? 'column' : 'row',
          height: '250px',
          border: '1px solid var(--border)',
        }"
      >
        <ResizablePanel :direction="direction" :initial-size="200" :min-size="80" :max-size="400">
          <div style="padding: 12px; color: var(--foreground); height: 100%">Resizable</div>
        </ResizablePanel>
        <div style="flex: 1; padding: 12px; color: var(--muted-foreground)">Fixed</div>
      </div>

      <template #controls>
        <HstSelect v-model="direction" title="Direction" :options="['horizontal', 'vertical']" />
      </template>
    </Variant>
  </Story>
</template>
