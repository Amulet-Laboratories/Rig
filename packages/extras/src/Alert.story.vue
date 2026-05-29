<script setup lang="ts">
import Alert from './Alert.vue'
import { ref } from 'vue'

const variant = ref<'info' | 'success' | 'warning' | 'error'>('info')
const title = ref('Alert Title')
const dismissible = ref(false)
</script>

<template>
  <Story title="Alert" icon="lucide:alert-triangle" group="extras">
    <Variant title="Info">
      <Alert variant="info" title="Information"> This is an informational alert message. </Alert>
    </Variant>

    <Variant title="Success">
      <Alert variant="success" title="Success"> The operation completed successfully. </Alert>
    </Variant>

    <Variant title="Warning">
      <Alert variant="warning" title="Warning"> Please review before proceeding. </Alert>
    </Variant>

    <Variant title="Error">
      <Alert variant="error" title="Error"> Something went wrong. Please try again. </Alert>
    </Variant>

    <Variant title="Dismissible">
      <Alert variant="info" title="Dismissible Alert" dismissible>
        Click the dismiss button to remove this alert.
      </Alert>
    </Variant>

    <Variant title="With Action Slot">
      <Alert variant="warning" title="Update Available">
        A new version is available for download.
        <template #action>
          <button style="padding: 4px 8px; font-size: 12px">Update Now</button>
        </template>
      </Alert>
    </Variant>

    <Variant title="Playground">
      <Alert :variant="variant" :title="title" :dismissible="dismissible">
        This is the alert description text for the playground variant.
      </Alert>

      <template #controls>
        <HstSelect
          v-model="variant"
          title="Variant"
          :options="['info', 'success', 'warning', 'error']"
        />
        <HstText v-model="title" title="Title" />
        <HstCheckbox v-model="dismissible" title="Dismissible" />
      </template>
    </Variant>
  </Story>
</template>
