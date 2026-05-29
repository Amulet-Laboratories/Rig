<script setup lang="ts">
import Resizer from './Resizer.vue'
</script>

<template>
  <Story title="Resizer" icon="lucide:grip-vertical" group="core">
    <Variant title="Horizontal">
      <div style="display: flex; height: 200px; border: 1px solid var(--border)">
        <div style="width: 200px; padding: 12px; color: var(--foreground)">Left panel</div>
        <Resizer orientation="horizontal" />
        <div style="flex: 1; padding: 12px; color: var(--foreground)">Right panel</div>
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
        <div style="height: 150px; padding: 12px; color: var(--foreground)">Top panel</div>
        <Resizer orientation="vertical" />
        <div style="flex: 1; padding: 12px; color: var(--foreground)">Bottom panel</div>
      </div>
    </Variant>
  </Story>
</template>
