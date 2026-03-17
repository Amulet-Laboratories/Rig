<script setup lang="ts">
import SplitView from './SplitView.vue'
import { ref } from 'vue'

const orientation = ref<'horizontal' | 'vertical'>('horizontal')
const resizable = ref(true)
const sizes = ref([300, 300])
const lastEvent = ref('')

function onUpdateSizes(newSizes: number[]) {
  sizes.value = newSizes
  lastEvent.value = `update:sizes → [${newSizes.join(', ')}]`
}
</script>

<template>
  <Story title="SplitView" icon="lucide:columns" group="layout">
    <Variant title="Default">
      <div style="height: 250px; border: 1px solid var(--border)">
        <SplitView orientation="horizontal" :sizes="[300, 300]" @update:sizes="onUpdateSizes">
          <template #pane-0>
            <div style="padding: 12px; color: var(--foreground)">Left pane</div>
          </template>
          <template #pane-1>
            <div style="padding: 12px; color: var(--foreground)">Right pane</div>
          </template>
        </SplitView>
      </div>
    </Variant>

    <Variant title="Vertical">
      <div style="height: 300px; border: 1px solid var(--border)">
        <SplitView orientation="vertical" :sizes="[150, 150]" @update:sizes="() => {}">
          <template #pane-0>
            <div style="padding: 12px; color: var(--foreground)">Top pane</div>
          </template>
          <template #pane-1>
            <div style="padding: 12px; color: var(--foreground)">Bottom pane</div>
          </template>
        </SplitView>
      </div>
    </Variant>

    <Variant title="Three Panes">
      <div style="height: 250px; border: 1px solid var(--border)">
        <SplitView
          orientation="horizontal"
          :sizes="[200, 200, 200]"
          :min-sizes="[80, 80, 80]"
          @update:sizes="() => {}"
        >
          <template #pane-0>
            <div style="padding: 12px; color: var(--foreground)">Explorer</div>
          </template>
          <template #pane-1>
            <div style="padding: 12px; color: var(--foreground)">Editor</div>
          </template>
          <template #pane-2>
            <div style="padding: 12px; color: var(--foreground)">Terminal</div>
          </template>
        </SplitView>
      </div>
    </Variant>

    <Variant title="Not Resizable">
      <div style="height: 250px; border: 1px solid var(--border)">
        <SplitView orientation="horizontal" :sizes="[250, 350]" :resizable="false">
          <template #pane-0>
            <div style="padding: 12px; color: var(--foreground)">Fixed left</div>
          </template>
          <template #pane-1>
            <div style="padding: 12px; color: var(--foreground)">Fixed right</div>
          </template>
        </SplitView>
      </div>
    </Variant>

    <Variant title="Playground">
      <div style="height: 250px; border: 1px solid var(--border)">
        <SplitView
          :orientation="orientation"
          :sizes="sizes"
          :resizable="resizable"
          @update:sizes="onUpdateSizes"
        >
          <template #pane-0>
            <div style="padding: 12px; color: var(--foreground)">First pane</div>
          </template>
          <template #pane-1>
            <div style="padding: 12px; color: var(--foreground)">Second pane</div>
          </template>
        </SplitView>
      </div>
      <div
        v-if="lastEvent"
        style="
          margin-top: 8px;
          padding: 6px 10px;
          background: var(--muted);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--foreground);
        "
      >
        {{ lastEvent }}
      </div>

      <template #controls>
        <HstSelect
          v-model="orientation"
          title="Orientation"
          :options="['horizontal', 'vertical']"
        />
        <HstCheckbox v-model="resizable" title="Resizable" />
      </template>
    </Variant>
  </Story>
</template>
