<script setup lang="ts">
import TimelineScrubber from './TimelineScrubber.vue'
import { ref } from 'vue'

const value = ref(35)
const disabled = ref(false)
</script>

<template>
  <Story title="TimelineScrubber" icon="lucide:rewind" group="temporal">
    <Variant title="Default">
      <TimelineScrubber v-model="value" :min="0" :max="100" />
      <div style="color: var(--muted-foreground); font-size: 12px; margin-top: 4px">
        Value: {{ value }}
      </div>
    </Variant>

    <Variant title="Time Format">
      <TimelineScrubber
        v-model="value"
        :min="0"
        :max="3600"
        :step="1"
        :format-value="
          (v: number) => {
            const m = Math.floor(v / 60)
            const s = v % 60
            return `${m}:${String(s).padStart(2, '0')}`
          }
        "
      />
    </Variant>

    <Variant title="Playground">
      <TimelineScrubber v-model="value" :min="0" :max="100" :disabled="disabled" />

      <template #controls>
        <HstSlider v-model="value" title="Value" :min="0" :max="100" />
        <HstCheckbox v-model="disabled" title="Disabled" />
      </template>
    </Variant>
  </Story>
</template>
