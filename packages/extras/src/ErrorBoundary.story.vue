<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- shouldThrow is a local ref toggled by @click, not a prop mutation */
import ErrorBoundary from './ErrorBoundary.vue'
import { defineComponent, h, ref } from 'vue'

const shouldThrow = ref(false)

const BrokenChild = defineComponent({
  props: { shouldThrow: { type: Boolean, default: false } },
  setup(props) {
    return () => {
      if (props.shouldThrow) {
        throw new Error('Something went wrong in child component')
      }
      return h(
        'div',
        {
          style:
            'padding: 16px; background: var(--card); border: 1px solid var(--border); border-radius: 6px; color: var(--foreground); font-size: 14px;',
          'data-rig-error-boundary-child': '',
        },
        'Child component rendered successfully.',
      )
    }
  },
})

const label = ref('Widget')
</script>

<template>
  <Story title="ErrorBoundary" icon="lucide:shield-alert" group="extras">
    <Variant title="Default (no error)">
      <ErrorBoundary label="Demo">
        <div
          style="
            padding: 16px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 6px;
            color: var(--foreground);
            font-size: 14px;
          "
        >
          This content renders normally inside the error boundary.
        </div>
      </ErrorBoundary>
    </Variant>

    <Variant title="Error State">
      <ErrorBoundary :key="shouldThrow ? 'error' : 'ok'" label="Chart">
        <BrokenChild :should-throw="shouldThrow" />
      </ErrorBoundary>
      <div style="margin-top: 12px">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="shouldThrow = !shouldThrow"
        >
          {{ shouldThrow ? 'Reset Child' : 'Trigger Error' }}
        </button>
        <p style="color: var(--muted-foreground); font-size: 13px; margin-top: 8px">
          Click the button to toggle between the normal and error states.
        </p>
      </div>
    </Variant>

    <Variant title="Custom Label">
      <ErrorBoundary :key="'custom-' + shouldThrow" :label="label">
        <BrokenChild :should-throw="shouldThrow" />
      </ErrorBoundary>
      <div style="margin-top: 12px">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="shouldThrow = !shouldThrow"
        >
          {{ shouldThrow ? 'Reset' : 'Trigger Error' }}
        </button>
      </div>
    </Variant>

    <Variant title="Playground">
      <ErrorBoundary :key="'pg-' + shouldThrow" :label="label">
        <BrokenChild :should-throw="shouldThrow" />
      </ErrorBoundary>
      <div style="margin-top: 12px">
        <button
          style="
            padding: 6px 12px;
            background: var(--muted);
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--foreground);
            cursor: pointer;
          "
          @click="shouldThrow = !shouldThrow"
        >
          {{ shouldThrow ? 'Reset' : 'Trigger Error' }}
        </button>
      </div>

      <template #controls>
        <HstText v-model="label" title="Label" />
        <HstCheckbox v-model="shouldThrow" title="Throw Error" />
      </template>
    </Variant>
  </Story>
</template>
