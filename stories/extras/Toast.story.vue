<script setup lang="ts">
import { ref } from 'vue'
import Toast from '@extras/Toast.vue'
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

function addInfo() {
  toastRef.value?.add({ message: 'File saved successfully', variant: 'info' })
}

function addWarning() {
  toastRef.value?.add({ message: 'Disk space running low', variant: 'warning' })
}

function addError() {
  toastRef.value?.add({ message: 'Build failed with 3 errors', variant: 'error' })
}
</script>

<template>
  <Story title="Toast" icon="lucide:bell-ring">
        <Variant title="Interactive">
      <div style="display: flex; gap: 8px; padding: 16px">
        <button @click="addInfo">Info Toast</button>
        <button @click="addWarning">Warning Toast</button>
        <button @click="addError">Error Toast</button>
      </div>
      <Toast ref="toastRef" />
    </Variant>
  </Story>
</template>
