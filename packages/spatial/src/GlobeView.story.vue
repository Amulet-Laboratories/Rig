<script setup lang="ts">
import GlobeView from './GlobeView.vue'
import { ref } from 'vue'

const rotationY = ref(0)
const showGrid = ref(true)

const markers = [
  { id: 'ny', lat: 40.71, lng: -74.01, label: 'New York', color: '#c9956d' },
  { id: 'london', lat: 51.51, lng: -0.13, label: 'London', color: '#6d8fc9' },
  { id: 'tokyo', lat: 35.68, lng: 139.69, label: 'Tokyo', color: '#6dc99e' },
  { id: 'sydney', lat: -33.87, lng: 151.21, label: 'Sydney', color: '#c96d8f' },
]
</script>

<template>
  <Story title="GlobeView" icon="lucide:globe" group="spatial">
    <Variant title="Default">
      <GlobeView :markers="markers" :size="350" />
    </Variant>

    <Variant title="No Grid">
      <GlobeView :markers="markers" :size="300" :show-grid="false" />
    </Variant>

    <Variant title="Playground">
      <GlobeView :markers="markers" :size="350" :rotation-y="rotationY" :show-grid="showGrid" />

      <template #controls>
        <HstSlider v-model="rotationY" title="Rotation Y" :min="-180" :max="180" />
        <HstCheckbox v-model="showGrid" title="Show Grid" />
      </template>
    </Variant>
  </Story>
</template>
