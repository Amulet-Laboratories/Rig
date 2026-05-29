<script setup lang="ts">
import { ref } from 'vue'
import { Modal } from '../../src/index'

const open = ref(true)
</script>

<template>
  <button id="outside-btn">Outside</button>
  <Modal v-model:open="open" aria-label="Focus trap test">
    <button id="first-btn">First</button>
    <input id="middle-input" type="text" placeholder="Middle" />
    <button id="last-btn">Last</button>
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
