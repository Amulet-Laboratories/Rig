<script setup lang="ts">
import Label from '@core/primitives/Label.vue'
import Input from '@core/primitives/Input.vue'

</script>

<template>
  <Story title="Label" icon="lucide:tag">
        <Variant title="With Input">
      <div style="padding: 24px; max-width: 320px; display: flex; flex-direction: column; gap: 6px">
        <Label for="demo-input">Email address</Label>
        <Input id="demo-input" placeholder="you@example.com" />
      </div>
    </Variant>

    <Variant title="Disabled">
      <div style="padding: 24px; max-width: 320px; display: flex; flex-direction: column; gap: 6px">
        <Label for="disabled-input" disabled>Disabled field</Label>
        <Input id="disabled-input" placeholder="Cannot edit" disabled />
      </div>
    </Variant>
  </Story>
</template>
