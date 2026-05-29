<script setup lang="ts">
import Button from './Button.vue'
import { ref } from 'vue'

const variant = ref('default')
const size = ref<'xs' | 'sm' | 'md' | 'lg'>('md')
const disabled = ref(false)
const loading = ref(false)
const tooltip = ref('Tooltip text')
const tooltipPlacement = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')
const clickCount = ref(0)
</script>

<template>
  <Story title="Button" icon="lucide:mouse-pointer-click" group="core">
    <Variant title="Default">
      <Button @click="() => {}">Click me</Button>
    </Variant>

    <Variant title="Variants">
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <Button variant="default" @click="() => {}">Default</Button>
        <Button variant="primary" @click="() => {}">Primary</Button>
        <Button variant="secondary" @click="() => {}">Secondary</Button>
        <Button variant="ghost" @click="() => {}">Ghost</Button>
        <Button variant="destructive" @click="() => {}">Destructive</Button>
        <Button variant="outline" @click="() => {}">Outline</Button>
      </div>
    </Variant>

    <Variant title="Sizes">
      <div style="display: flex; gap: 8px; align-items: center">
        <Button size="xs" @click="() => {}">Extra Small</Button>
        <Button size="sm" @click="() => {}">Small</Button>
        <Button size="md" @click="() => {}">Medium</Button>
        <Button size="lg" @click="() => {}">Large</Button>
      </div>
    </Variant>

    <Variant title="States">
      <div style="display: flex; gap: 8px">
        <Button @click="() => {}">Normal</Button>
        <Button disabled @click="() => {}">Disabled</Button>
        <Button loading @click="() => {}">Loading</Button>
      </div>
    </Variant>

    <Variant title="With Icon">
      <div style="display: flex; gap: 8px">
        <Button icon="mdi:plus" aria-label="Add item" @click="() => {}" />
        <Button icon="mdi:check" @click="() => {}">Confirm</Button>
      </div>
    </Variant>

    <Variant title="Polymorphic (as)">
      <div style="display: flex; gap: 8px; align-items: center">
        <Button @click="() => {}">button (default)</Button>
        <Button
          as="a"
          href="https://example.com"
          target="_blank"
          variant="primary"
          @click="() => {}"
        >
          a href link
        </Button>
        <Button as="div" variant="outline" @click="() => {}"> div element </Button>
      </div>
    </Variant>

    <Variant title="Tooltip">
      <div style="display: flex; gap: 12px; align-items: center">
        <Button tooltip="Save your progress" @click="() => {}">Hover for tooltip</Button>
        <Button
          icon="mdi:information"
          aria-label="Info"
          tooltip="Tooltip from aria-label"
          @click="() => {}"
        />
        <Button tooltip="Appears above" tooltip-placement="top" @click="() => {}">Top</Button>
        <Button tooltip="Appears to the right" tooltip-placement="right" @click="() => {}"
          >Right</Button
        >
      </div>
    </Variant>

    <Variant title="Icon Slots">
      <div style="display: flex; gap: 8px; align-items: center">
        <Button @click="() => {}">
          <template #leading-icon>
            <span style="font-size: 14px">&#9734;</span>
          </template>
          Leading icon slot
        </Button>
        <Button @click="() => {}">
          Trailing icon slot
          <template #trailing-icon>
            <span style="font-size: 14px">&#8594;</span>
          </template>
        </Button>
        <Button @click="() => {}">
          <template #leading-icon>
            <span style="font-size: 14px">&#128274;</span>
          </template>
          Both slots
          <template #trailing-icon>
            <span style="font-size: 14px">&#8595;</span>
          </template>
        </Button>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start">
        <Button
          :variant="variant"
          :size="size"
          :disabled="disabled"
          :loading="loading"
          :tooltip="tooltip || undefined"
          :tooltip-placement="tooltipPlacement"
          @click="clickCount++"
        >
          Playground Button
        </Button>
        <div style="font-size: 12px; color: var(--muted-foreground)">
          Click count: {{ clickCount }}
        </div>
      </div>

      <template #controls>
        <HstSelect
          v-model="variant"
          title="Variant"
          :options="['default', 'primary', 'secondary', 'ghost', 'destructive', 'outline']"
        />
        <HstSelect v-model="size" title="Size" :options="['xs', 'sm', 'md', 'lg']" />
        <HstCheckbox v-model="disabled" title="Disabled" />
        <HstCheckbox v-model="loading" title="Loading" />
        <HstText v-model="tooltip" title="Tooltip" />
        <HstSelect
          v-model="tooltipPlacement"
          title="Tooltip Placement"
          :options="['top', 'bottom', 'left', 'right']"
        />
      </template>
    </Variant>
  </Story>
</template>
