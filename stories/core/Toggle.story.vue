<script setup lang="ts">
import { ref } from 'vue'
import Toggle from '@core/primitives/Toggle.vue'
import ToggleGroup from '@core/primitives/ToggleGroup.vue'
const pressed = ref(false)
const disabled = ref(false)
const groupValue = ref('center')
</script>

<template>
  <Story title="Toggle" icon="lucide:toggle-right">
    <template #controls>
      <HstCheckbox v-model="disabled" title="Disabled" />
    </template>

    <Variant title="Single Toggle">
      <div style="padding: 24px; display: flex; gap: 8px">
        <Toggle v-model:pressed="pressed" :disabled="disabled">
          Bold
        </Toggle>
      </div>
    </Variant>

    <Variant title="Toggle Group (single)">
      <div style="padding: 24px">
        <ToggleGroup v-model="groupValue" type="single">
          <template #default="{ isPressed, toggle }">
            <Toggle :pressed="isPressed('left')" @update:pressed="toggle('left')">Left</Toggle>
            <Toggle :pressed="isPressed('center')" @update:pressed="toggle('center')">Center</Toggle>
            <Toggle :pressed="isPressed('right')" @update:pressed="toggle('right')">Right</Toggle>
          </template>
        </ToggleGroup>
      </div>
    </Variant>

    <Variant title="States">
      <div style="padding: 24px; display: flex; gap: 8px">
        <Toggle :pressed="false">Off</Toggle>
        <Toggle pressed>On</Toggle>
        <Toggle :pressed="false" disabled>Disabled</Toggle>
      </div>
    </Variant>
  </Story>
</template>
