<script setup lang="ts">
import NotificationCenter from '@extras/NotificationCenter.vue'
import { useNotifications } from '@extras/useNotifications'
const { push } = useNotifications()

function addNotification() {
  push({
    message: 'Project compiled successfully.',
    variant: 'info',
  })
}
</script>

<template>
  <Story title="NotificationCenter" icon="lucide:bell">
        <Variant title="Interactive">
      <div style="display: flex; align-items: center; gap: 16px; padding: 16px">
        <button @click="addNotification">Add Notification</button>
        <NotificationCenter />
      </div>
    </Variant>
  </Story>
</template>
