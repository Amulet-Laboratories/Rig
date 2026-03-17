<script setup lang="ts">
import Tooltip from './Tooltip.vue'
</script>

<template>
  <Story title="Tooltip" icon="lucide:message-circle" group="extras">
    <Variant title="Default">
      <div style="padding: 40px; color: var(--foreground)">
        <p style="color: var(--muted-foreground); margin: 0 0 12px 0">
          The Tooltip component renders tooltips triggered by the
          <code>useTooltip()</code> composable. Hover over elements that use the composable to see
          tooltips.
        </p>
        <Tooltip />
      </div>
    </Variant>
  </Story>
</template>
