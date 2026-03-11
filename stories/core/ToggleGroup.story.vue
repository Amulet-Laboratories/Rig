<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Toggle from '@core/primitives/Toggle.vue'
import ToggleGroup from '@core/primitives/ToggleGroup.vue'

const { theme, themeOptions } = useHexTheme()

const singleValue = ref('center')
const multiValue = ref<string[]>(['bold'])
</script>

<template>
  <Story title="Core / ToggleGroup" icon="lucide:group">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
    </template>

    <Variant title="Single Select">
      <div style="padding: 24px">
        <ToggleGroup v-model="singleValue" type="single">
          <template #default="{ isPressed, toggle }">
            <Toggle :pressed="isPressed('left')" @update:pressed="toggle('left')">Left</Toggle>
            <Toggle :pressed="isPressed('center')" @update:pressed="toggle('center')">Center</Toggle>
            <Toggle :pressed="isPressed('right')" @update:pressed="toggle('right')">Right</Toggle>
          </template>
        </ToggleGroup>
      </div>
    </Variant>

    <Variant title="Multiple Select">
      <div style="padding: 24px">
        <ToggleGroup v-model="multiValue" type="multiple">
          <template #default="{ isPressed, toggle }">
            <Toggle :pressed="isPressed('bold')" @update:pressed="toggle('bold')">B</Toggle>
            <Toggle :pressed="isPressed('italic')" @update:pressed="toggle('italic')">I</Toggle>
            <Toggle :pressed="isPressed('underline')" @update:pressed="toggle('underline')">U</Toggle>
          </template>
        </ToggleGroup>
      </div>
    </Variant>
  </Story>
</template>
