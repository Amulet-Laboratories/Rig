<script setup lang="ts">
import Dot from './Dot.vue'
import { ref } from 'vue'

const pulse = ref(false)
const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
</script>

<template>
  <Story title="Dot" icon="lucide:circle" group="core">
    <Variant title="Default">
      <Dot />
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 12px; align-items: center">
        <Dot size="xs" />
        <Dot size="sm" />
        <Dot size="md" />
        <Dot size="lg" />
      </div>
    </Variant>

    <Variant title="Colors">
      <div style="display: flex; gap: 12px; align-items: center">
        <Dot color="var(--primary)" />
        <Dot color="#22c55e" />
        <Dot color="#ef4444" />
        <Dot color="#eab308" />
        <Dot color="#3b82f6" />
      </div>
    </Variant>

    <Variant title="Pulsing">
      <div style="display: flex; gap: 12px; align-items: center">
        <Dot pulse color="#22c55e" />
        <Dot pulse color="#ef4444" />
        <Dot pulse color="#3b82f6" />
      </div>
    </Variant>

    <Variant title="Playground">
      <Dot :size="size" :pulse="pulse" />

      <template #controls>
        <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
        <HstCheckbox v-model="pulse" title="Pulse" />
      </template>
    </Variant>
  </Story>
</template>
