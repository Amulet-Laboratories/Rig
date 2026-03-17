<script setup lang="ts">
import Card from './Card.vue'
import { ref } from 'vue'

const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
const interactive = ref(false)
</script>

<template>
  <Story title="Card" icon="lucide:square" group="core">
    <Variant title="Default">
      <Card>
        <template #header>Card Header</template>
        Basic card content goes here.
        <template #footer>Card Footer</template>
      </Card>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 12px; flex-wrap: wrap">
        <Card size="sm">
          <template #header>Small</template>
          Compact card
        </Card>
        <Card size="md">
          <template #header>Medium</template>
          Standard card
        </Card>
        <Card size="lg">
          <template #header>Large</template>
          Spacious card
        </Card>
      </div>
    </Variant>

    <Variant title="Interactive">
      <Card interactive @click="() => {}">
        <template #header>Clickable Card</template>
        This card responds to clicks.
      </Card>
    </Variant>

    <Variant title="Playground">
      <Card :size="size" :interactive="interactive" @click="() => {}">
        <template #header>Playground Card</template>
        Adjust props using the controls.
        <template #footer>Footer area</template>
      </Card>

      <template #controls>
        <HstSelect v-model="size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="interactive" title="Interactive" />
      </template>
    </Variant>
  </Story>
</template>
