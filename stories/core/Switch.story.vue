<script setup lang="ts">
import { ref } from 'vue'
import Switch from '@core/primitives/Switch.vue'
const on = ref(false)
const disabled = ref(false)
</script>

<template>
  <Story title="Switch" icon="lucide:toggle-left">
    <template #controls>
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px">
        <Switch v-model="on" :disabled="disabled">Dark mode</Switch>
      </div>
    </Variant>

    <Variant title="States">
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px">
        <Switch :model-value="false">Off</Switch>
        <Switch model-value>On</Switch>
        <Switch :model-value="false" disabled>Disabled Off</Switch>
        <Switch model-value disabled>Disabled On</Switch>
      </div>
    </Variant>
  </Story>
</template>
