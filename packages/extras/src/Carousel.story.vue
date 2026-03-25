<script setup lang="ts">
import Carousel from './Carousel.vue'
import { ref } from 'vue'

const slides = [
  { id: 1, color: 'var(--rig-color-info, #3b82f6)', label: 'Slide 1' },
  { id: 2, color: 'var(--rig-color-success, #22c55e)', label: 'Slide 2' },
  { id: 3, color: 'var(--rig-color-warning, #eab308)', label: 'Slide 3' },
]

const defaultIndex = ref(0)
const autoplayIndex = ref(0)
const loopIndex = ref(0)
const playgroundIndex = ref(0)

const autoplay = ref(false)
const loop = ref(false)
const interval = ref(3000)
</script>

<template>
  <Story title="Carousel" icon="lucide:gallery-horizontal" group="extras">
    <Variant title="Default">
      <Carousel v-model="defaultIndex" :items="slides">
        <template #slide="{ item, active }">
          <div
            :style="{
              background: (item as (typeof slides)[0]).color,
              padding: '40px',
              textAlign: 'center',
              display: active ? 'block' : 'none',
              color: '#fff',
              fontWeight: 'bold',
            }"
          >
            {{ (item as (typeof slides)[0]).label }}
          </div>
        </template>
      </Carousel>
    </Variant>

    <Variant title="Autoplay">
      <Carousel v-model="autoplayIndex" :items="slides" autoplay :interval="3000">
        <template #slide="{ item, active }">
          <div
            :style="{
              background: (item as (typeof slides)[0]).color,
              padding: '40px',
              textAlign: 'center',
              display: active ? 'block' : 'none',
              color: '#fff',
              fontWeight: 'bold',
            }"
          >
            {{ (item as (typeof slides)[0]).label }}
          </div>
        </template>
      </Carousel>
    </Variant>

    <Variant title="Loop">
      <Carousel v-model="loopIndex" :items="slides" loop>
        <template #slide="{ item, active }">
          <div
            :style="{
              background: (item as (typeof slides)[0]).color,
              padding: '40px',
              textAlign: 'center',
              display: active ? 'block' : 'none',
              color: '#fff',
              fontWeight: 'bold',
            }"
          >
            {{ (item as (typeof slides)[0]).label }}
          </div>
        </template>
      </Carousel>
    </Variant>

    <Variant title="Playground">
      <Carousel
        v-model="playgroundIndex"
        :items="slides"
        :autoplay="autoplay"
        :loop="loop"
        :interval="interval"
      >
        <template #slide="{ item, active }">
          <div
            :style="{
              background: (item as (typeof slides)[0]).color,
              padding: '40px',
              textAlign: 'center',
              display: active ? 'block' : 'none',
              color: '#fff',
              fontWeight: 'bold',
            }"
          >
            {{ (item as (typeof slides)[0]).label }}
          </div>
        </template>
      </Carousel>
      <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 8px">
        Current slide: {{ playgroundIndex + 1 }} / {{ slides.length }}
      </div>

      <template #controls>
        <HstCheckbox v-model="autoplay" title="Autoplay" />
        <HstCheckbox v-model="loop" title="Loop" />
        <HstSlider v-model="interval" title="Interval (ms)" :min="1000" :max="10000" :step="500" />
      </template>
    </Variant>
  </Story>
</template>
