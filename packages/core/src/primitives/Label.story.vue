<script setup lang="ts">
import Label from './Label.vue'
</script>

<template>
  <Story title="Label" icon="lucide:type" group="core">
    <Variant title="Default">
      <Label for="demo-input">Username</Label>
    </Variant>

    <Variant title="Disabled">
      <Label for="demo-input" disabled>Disabled Label</Label>
    </Variant>

    <Variant title="With Input">
      <div style="display: flex; flex-direction: column; gap: 4px">
        <Label for="label-demo">Email address</Label>
        <input
          id="label-demo"
          type="email"
          placeholder="you@example.com"
          style="
            padding: 6px 10px;
            border: 1px solid var(--border);
            border-radius: 4px;
            background: var(--input);
            color: var(--foreground);
          "
        />
      </div>
    </Variant>
  </Story>
</template>
