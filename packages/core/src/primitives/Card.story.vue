<script setup lang="ts">
import Card from './Card.vue'
import Badge from './Badge.vue'
import Icon from './Icon.vue'
import { ref } from 'vue'

const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
const interactive = ref(false)
const selected = ref(false)
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

    <Variant title="Selected">
      <div style="display: flex; gap: 12px; flex-wrap: wrap">
        <Card interactive @click="() => {}">
          <template #header>Standard</template>
          Not selected.
        </Card>
        <Card interactive selected @click="() => {}">
          <template #header>Featured</template>
          Persistent highlighted state via the <code>selected</code> prop.
        </Card>
      </div>
    </Variant>

    <Variant title="Row layout">
      <div style="display: flex; flex-direction: column; gap: 8px">
        <Card size="sm" layout="row" columns="1fr auto auto" interactive @click="() => {}">
          <span>Acme Corp — Q3 engagement</span>
          <Badge variant="muted" size="sm">Active</Badge>
          <span style="font-variant-numeric: tabular-nums">$12,400</span>
        </Card>
        <Card size="sm" layout="row" columns="auto 1fr auto" interactive @click="() => {}">
          <Icon icon="lucide:file-text" width="14" height="14" />
          <span>Invoice #1041</span>
          <span style="font-variant-numeric: tabular-nums">$3,200</span>
        </Card>
      </div>
    </Variant>

    <Variant title="Playground">
      <Card :size="size" :interactive="interactive" :selected="selected" @click="() => {}">
        <template #header>Playground Card</template>
        Adjust props using the controls.
        <template #footer>Footer area</template>
      </Card>

      <template #controls>
        <HstSelect v-model="size" title="Size" :options="['sm', 'md', 'lg']" />
        <HstCheckbox v-model="interactive" title="Interactive" />
        <HstCheckbox v-model="selected" title="Selected" />
      </template>
    </Variant>
  </Story>
</template>
