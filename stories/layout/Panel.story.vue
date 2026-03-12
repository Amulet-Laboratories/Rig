<script setup lang="ts">
import { ref } from 'vue'
import Panel from '@layout/Panel.vue'
import Button from '@core/primitives/Button.vue'
const open = ref(true)
const size = ref(200)
</script>

<template>
  <Story title="Panel" icon="lucide:panel-bottom">
    <template #controls>
      <HstCheckbox v-model="open" title="Open" />
    </template>

    <Variant title="Bottom Panel">
      <div style="height: 400px; display: flex; flex-direction: column; position: relative">
        <div style="flex: 1; padding: 16px">
          <Button @click="open = !open">Toggle Panel</Button>
        </div>
        <Panel v-model:open="open" v-model:size="size" position="bottom">
          <template #header>
            <span style="font-weight: 600">Terminal</span>
          </template>
          <div style="padding: 8px; font-family: monospace; font-size: 13px">
            $ pnpm build
          </div>
        </Panel>
      </div>
    </Variant>
  </Story>
</template>
