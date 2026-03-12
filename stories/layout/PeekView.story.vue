<script setup lang="ts">
import { ref } from 'vue'
import PeekView from '@layout/PeekView.vue'
import Button from '@core/primitives/Button.vue'
const open = ref(false)
</script>

<template>
  <Story title="PeekView" icon="lucide:eye">
        <Variant title="Interactive">
      <div style="padding: 24px; position: relative; min-height: 200px">
        <Button @click="open = true">Show Peek View</Button>
        <PeekView v-model:open="open" title="Definition Preview">
          <div style="padding: 12px; font-family: monospace; font-size: 13px">
            <p>function greet(name: string): string {</p>
            <p>&nbsp;&nbsp;return `Hello, ${'{'}name${'}'}`</p>
            <p>}</p>
          </div>
        </PeekView>
      </div>
    </Variant>
  </Story>
</template>
