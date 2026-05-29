<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from '../../src/index'

const open = ref(true)
</script>

<template>
  <button id="open-btn" @click="open = true">Open modal</button>
  <Modal v-model:open="open" persistent aria-label="Persistent modal">
    <p>Cannot close by clicking overlay</p>
    <button id="close-btn" @click="open = false">Close</button>
  </Modal>
</template>

<style>
[data-rig-modal-overlay] {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}
[data-rig-modal] {
  background: white;
  padding: 20px;
  width: 300px;
}
</style>
