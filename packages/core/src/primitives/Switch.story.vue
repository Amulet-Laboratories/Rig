<script setup lang="ts">
import Switch from './Switch.vue'
import { ref } from 'vue'

const value = ref(false)
const disabled = ref(false)
</script>

<template>
  <Story title="Switch" icon="lucide:toggle-right" group="core">
    <Variant title="Default">
      <Switch v-model="value" aria-label="Toggle feature" />
      <p style="margin-top: 8px; color: var(--muted-foreground); font-size: 12px">
        State: {{ value ? 'On' : 'Off' }}
      </p>
    </Variant>

    <Variant title="With Label">
      <Switch v-model="value">Dark mode</Switch>
    </Variant>

    <Variant title="Disabled">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Switch :model-value="false" disabled>Off (disabled)</Switch>
        <Switch model-value disabled>On (disabled)</Switch>
      </div>
    </Variant>

    <Variant title="Playground">
      <Switch v-model="value" :disabled="disabled" aria-label="Toggle">
        {{ value ? 'Enabled' : 'Disabled' }}
      </Switch>

      <template #controls>
        <HstCheckbox v-model="value" title="Checked" />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
