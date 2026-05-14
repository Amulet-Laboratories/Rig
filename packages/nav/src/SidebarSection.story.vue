<script setup lang="ts">
import SidebarSection from './SidebarSection.vue'

const counts = [
  { label: 'Active', value: 12, tone: 'info' as const },
  { label: 'Stale', value: 3, tone: 'warning' as const },
  { label: 'Resolved', value: 47, tone: 'success' as const },
  { label: 'Critical', value: 1, tone: 'danger' as const },
]

const minimal = [
  { label: 'Records', value: 124 },
  { label: 'Tags', value: 19 },
]
</script>

<template>
  <Story title="SidebarSection" icon="lucide:layout-list" group="nav">
    <Variant title="Counts with tones">
      <div style="width: 240px; background: var(--color-background, #1e1e1e); padding: 8px 0">
        <SidebarSection title="Counts" :rows="counts" />
      </div>
    </Variant>

    <Variant title="Plain rows">
      <div style="width: 240px; background: var(--color-background, #1e1e1e); padding: 8px 0">
        <SidebarSection title="Summary" :rows="minimal" />
      </div>
    </Variant>

    <Variant title="Custom slot only">
      <div style="width: 240px; background: var(--color-background, #1e1e1e); padding: 8px 0">
        <SidebarSection title="This month">
          <ul style="padding: 4px 8px; font-family: var(--font-mono); font-size: 11px">
            <li>Renewal — Jamie</li>
            <li>Filing — Smith case</li>
          </ul>
        </SidebarSection>
      </div>
    </Variant>

    <Variant title="Title-suffix slot">
      <div style="width: 240px; background: var(--color-background, #1e1e1e); padding: 8px 0">
        <SidebarSection :rows="counts">
          <template #title>Status</template>
          <template #title-suffix>
            <span style="font-size: 9px; color: var(--color-warning)">! 4</span>
          </template>
        </SidebarSection>
      </div>
    </Variant>
  </Story>
</template>
