<script setup lang="ts">
import MapCanvas from './MapCanvas.vue'

const markers = [
  { id: '1', lat: 40.71, lng: -74.01, label: 'New York' },
  { id: '2', lat: 34.05, lng: -118.24, label: 'Los Angeles' },
  { id: '3', lat: 41.88, lng: -87.63, label: 'Chicago' },
  { id: '4', lat: 29.76, lng: -95.37, label: 'Houston' },
]
</script>

<template>
  <Story title="MapCanvas" icon="lucide:map" group="spatial">
    <Variant title="Default">
      <MapCanvas
        :markers="markers"
        :center-lat="39"
        :center-lng="-98"
        :zoom="4"
        :width="600"
        :height="400"
      />
    </Variant>

    <Variant title="No Markers">
      <MapCanvas :width="500" :height="300" :zoom="2" />
    </Variant>
  </Story>
</template>
