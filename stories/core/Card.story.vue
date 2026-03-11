<script setup lang="ts">
import { ref } from 'vue'
import { useHexTheme } from '../../src/histoire/useHexTheme'
import Card from '@core/primitives/Card.vue'
import type { Size } from '@core/types'

const { theme, themeOptions } = useHexTheme()

const variant = ref('')
const size = ref<Size>('md')
const interactive = ref(false)
</script>

<template>
  <Story title="Core / Card" icon="lucide:square">
    <template #controls>
      <HstSelect v-model="theme" title="Theme" :options="themeOptions" />
      <HstSelect
        v-model="variant"
        title="Variant"
        :options="['', 'elevated', 'outlined']"
      />
      <HstSelect
        v-model="size"
        title="Size"
        :options="['xs', 'sm', 'md', 'lg', 'xl']"
      />
      <HstCheckbox v-model="interactive" title="Interactive" />
    </template>

    <Variant title="Interactive">
      <div style="padding: 24px; max-width: 400px">
        <Card
          :variant="variant || undefined"
          :size="size"
          :interactive="interactive"
        >
          <template #header>Card Header</template>
          <p>Card body content goes here. This is a versatile container.</p>
          <template #footer>Card Footer</template>
        </Card>
      </div>
    </Variant>

    <Variant title="With Accent">
      <div style="padding: 24px; max-width: 400px">
        <Card accent="#c9956d">
          <template #header>Accented Card</template>
          <p>This card has a custom accent color applied.</p>
        </Card>
      </div>
    </Variant>

    <Variant title="Interactive Card">
      <div style="padding: 24px; max-width: 400px">
        <Card interactive>
          <template #header>Clickable Card</template>
          <p>Click this card to trigger an action.</p>
        </Card>
      </div>
    </Variant>
  </Story>
</template>
