<script setup lang="ts">
import StatLine from './StatLine.vue'
</script>

<template>
  <Story title="StatLine" icon="lucide:rows-3" group="data">
    <Variant title="Default Tones">
      <div style="max-width: 320px; display: flex; flex-direction: column; gap: 4px">
        <StatLine label="Income" value="$5,200" tone="success" />
        <StatLine label="Spending" value="$3,100" tone="danger" />
        <StatLine label="Savings" value="$2,100" tone="success" />
        <StatLine label="Net Worth" value="$48,200" tone="default" separator bold />
      </div>
    </Variant>

    <Variant title="Muted + Info">
      <div style="max-width: 320px; display: flex; flex-direction: column; gap: 4px">
        <StatLine label="Active Clients" value="12" tone="info" />
        <StatLine label="Prospects" value="3" tone="muted" />
        <StatLine label="Contracts" value="8" tone="info" />
        <StatLine label="Foundation" value="85%" tone="default" separator bold />
      </div>
    </Variant>

    <Variant title="With Slots">
      <div style="max-width: 320px; display: flex; flex-direction: column; gap: 4px">
        <StatLine tone="success">
          <template #label><em>Custom Label</em></template>
          <strong>$1,234</strong>
        </StatLine>
      </div>
    </Variant>
  </Story>
</template>
