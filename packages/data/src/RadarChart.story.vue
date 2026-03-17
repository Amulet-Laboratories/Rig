<script setup lang="ts">
import RadarChart from './RadarChart.vue'
</script>

<template>
  <Story title="RadarChart" icon="lucide:radar" group="data">
    <Variant title="Default">
      <RadarChart
        :axes="[
          { label: 'Speed' },
          { label: 'Power' },
          { label: 'Range' },
          { label: 'Accuracy' },
          { label: 'Defense' },
        ]"
        :series="[{ label: 'Player A', data: [80, 90, 60, 70, 50], color: '#c9956d' }]"
      />
    </Variant>

    <Variant title="Multiple Series">
      <RadarChart
        :axes="[
          { label: 'Speed', max: 100 },
          { label: 'Power', max: 100 },
          { label: 'Range', max: 100 },
          { label: 'Accuracy', max: 100 },
          { label: 'Defense', max: 100 },
          { label: 'Stamina', max: 100 },
        ]"
        :series="[
          { label: 'Player A', data: [80, 90, 60, 70, 50, 85], color: '#c9956d' },
          { label: 'Player B', data: [60, 70, 90, 80, 75, 60], color: '#6d8fc9' },
        ]"
      />
    </Variant>
  </Story>
</template>
