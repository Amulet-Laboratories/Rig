<script setup lang="ts">
import PulseIndicator from './PulseIndicator.vue'
import { ref } from 'vue'

const active = ref(true)
</script>

<template>
  <Story title="PulseIndicator" icon="lucide:radio" group="core">
    <Variant title="Default">
      <PulseIndicator />
    </Variant>

    <Variant title="Active vs Inactive">
      <div style="display: flex; gap: 24px; align-items: center; color: var(--foreground)">
        <div style="display: flex; align-items: center; gap: 8px">
          <PulseIndicator active />
          Active
        </div>
        <div style="display: flex; align-items: center; gap: 8px">
          <PulseIndicator :active="false" />
          Inactive
        </div>
      </div>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; gap: 16px; align-items: center">
        <PulseIndicator color="#22c55e" />
        <PulseIndicator color="#ef4444" />
        <PulseIndicator color="#3b82f6" />
        <PulseIndicator color="#eab308" />
        <PulseIndicator color="var(--primary)" />
      </div>
    </Variant>

    <Variant title="Playground">
      <PulseIndicator :active="active" />

      <template #controls>
        <HstCheckbox v-model="active" title="Active" />
      </template>
    </Variant>
  </Story>
</template>
