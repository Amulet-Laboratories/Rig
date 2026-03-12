<script setup lang="ts">
import { ref } from 'vue'
import Popover from '@layout/Popover.vue'
import Button from '@core/primitives/Button.vue'

import type { Placement } from '@floating-ui/vue'
const open = ref(false)
const placement = ref<Placement>('bottom')
</script>

<template>
  <Story title="Popover" icon="lucide:message-square">
    <template #controls>
      <HstSelect
        v-model="placement"
        title="Placement"
        :options="['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end']"
      />
    </template>

    <Variant title="Interactive">
      <div style="padding: 80px; display: flex; justify-content: center">
        <Popover v-model:open="open" :placement="placement">
          <template #trigger="{ toggle }">
            <Button @click="toggle">Toggle Popover</Button>
          </template>
          <div style="padding: 16px; max-width: 240px">
            <p style="font-weight: 500; margin-bottom: 4px">Popover Title</p>
            <p style="font-size: 13px">This is popover content. It floats near the trigger.</p>
          </div>
        </Popover>
      </div>
    </Variant>
  </Story>
</template>
