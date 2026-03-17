<script setup lang="ts">
import PlaybackControls from './PlaybackControls.vue'
import { ref } from 'vue'

const playing = ref(false)
const currentTime = ref(30)
const speed = ref(1)
const loop = ref(false)
</script>

<template>
  <Story title="PlaybackControls" icon="lucide:play" group="temporal">
    <Variant title="Default">
      <PlaybackControls
        v-model:playing="playing"
        :current-time="currentTime"
        :duration="100"
        @play="playing = true"
        @pause="playing = false"
        @seek="(t) => (currentTime = t)"
      />
    </Variant>

    <Variant title="With Speed Control">
      <PlaybackControls
        v-model:playing="playing"
        :current-time="currentTime"
        :duration="100"
        :speed="speed"
        show-speed
        @play="playing = true"
        @pause="playing = false"
        @seek="(t) => (currentTime = t)"
        @speed-change="(s) => (speed = s)"
      />
    </Variant>

    <Variant title="Playground">
      <PlaybackControls
        v-model:playing="playing"
        :current-time="currentTime"
        :duration="100"
        :speed="speed"
        :loop="loop"
        show-speed
        @play="playing = true"
        @pause="playing = false"
        @seek="(t) => (currentTime = t)"
        @speed-change="(s) => (speed = s)"
      />

      <template #controls>
        <HstSlider v-model="currentTime" title="Time" :min="0" :max="100" />
        <HstCheckbox v-model="loop" title="Loop" />
        <HstCheckbox v-model="playing" title="Playing" />
      </template>
    </Variant>
  </Story>
</template>
