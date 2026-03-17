<script setup lang="ts">
import ParticleField from './ParticleField.vue'
import { ref } from 'vue'

const active = ref(true)
const speed = ref(1)
const count = ref(50)
</script>

<template>
  <Story title="ParticleField" icon="lucide:sparkles" group="temporal">
    <Variant title="Default">
      <ParticleField :width="500" :height="300" :count="50" />
    </Variant>

    <Variant title="Dense">
      <ParticleField :width="500" :height="300" :count="150" :speed="0.5" />
    </Variant>

    <Variant title="Playground">
      <ParticleField :width="500" :height="300" :count="count" :speed="speed" :active="active" />

      <template #controls>
        <HstSlider v-model="count" title="Count" :min="10" :max="200" />
        <HstSlider v-model="speed" title="Speed" :min="0.1" :max="3" :step="0.1" />
        <HstCheckbox v-model="active" title="Active" />
      </template>
    </Variant>
  </Story>
</template>
