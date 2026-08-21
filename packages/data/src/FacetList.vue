<script setup lang="ts">
// FacetList — a checkbox facet group with counts, for building faceted
// sidebars over search results.
//
// The pieces existed (Checkbox, Badge, useDataTable.filterOptions) but every
// consumer that wanted "rights ▸ cc0 (15,385)" composed them by hand. The
// shape is standard enough to own: options with counts, a string[] model,
// optional search over long vocabularies, and a show-more fold.
//
// Zero-count options render dimmed (`data-empty`), NEVER hidden: under
// sibling-preserving faceting a zero tells you what checking this would do,
// and hiding it makes the panel jump as counts change. Checked options are
// always visible regardless of the fold — a filter you cannot see is a filter
// you cannot clear.
import { ref, computed } from 'vue'
import Checkbox from '@core/primitives/Checkbox.vue'
import Input from '@core/primitives/Input.vue'

export interface FacetOption {
  value: string
  /** Display label; falls back to `value`. */
  label?: string
  count?: number
}

const props = withDefaults(
  defineProps<{
    /** Group heading. Also the accessible group label. */
    title?: string
    options: FacetOption[]
    /** Render a filter input over the options — for 40-tag vocabularies. */
    searchable?: boolean
    /** Fold unchecked options past this many behind "show all". */
    limit?: number
    disabled?: boolean
  }>(),
  {
    title: '',
    searchable: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  /** Fires alongside the model update with the toggled value. */
  change: [values: string[], toggled: string]
}>()

defineSlots<{
  /** Replace an option row's content. */
  option?: (props: { option: FacetOption; checked: boolean }) => unknown
}>()

const modelValue = defineModel<string[]>({ default: () => [] })

const query = ref('')
const expanded = ref(false)

const checked = computed(() => new Set(modelValue.value))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(
    (o) => o.value.toLowerCase().includes(q) || (o.label ?? '').toLowerCase().includes(q),
  )
})

const visible = computed(() => {
  if (!props.limit || expanded.value || filtered.value.length <= props.limit) return filtered.value
  const kept: FacetOption[] = []
  let unchecked = 0
  for (const o of filtered.value) {
    if (checked.value.has(o.value)) kept.push(o)
    else if (unchecked < props.limit) {
      kept.push(o)
      unchecked++
    }
  }
  return kept
})

const foldedCount = computed(() => filtered.value.length - visible.value.length)

function toggle(value: string, on: boolean) {
  const cur = modelValue.value.filter((v) => v !== value)
  if (on) cur.push(value)
  modelValue.value = cur
  emit('change', cur, value)
}

function clear() {
  modelValue.value = []
  emit('change', [], '')
}
</script>

<template>
  <div
    data-rig-facet-list
    role="group"
    :aria-label="title || undefined"
    :data-disabled="disabled || undefined"
  >
    <div v-if="title" data-rig-facet-list-title>
      {{ title }}
      <button
        v-if="modelValue.length"
        type="button"
        data-rig-facet-list-clear
        :disabled="disabled"
        @click="clear"
      >
        clear
      </button>
    </div>
    <Input
      v-if="searchable"
      v-model="query"
      data-rig-facet-list-search
      size="sm"
      type="search"
      clearable
      :disabled="disabled"
      :placeholder="`Filter ${title.toLowerCase() || 'options'}…`"
      :aria-label="`Filter ${title || 'options'}`"
    />
    <div data-rig-facet-list-options>
      <label
        v-for="option in visible"
        :key="option.value"
        data-rig-facet-list-option
        :data-checked="checked.has(option.value) || undefined"
        :data-empty="option.count === 0 || undefined"
      >
        <Checkbox
          :model-value="checked.has(option.value)"
          :disabled="disabled"
          :aria-label="option.label ?? option.value"
          @update:model-value="toggle(option.value, $event)"
        />
        <slot name="option" :option="option" :checked="checked.has(option.value)">
          <span data-rig-facet-list-label>{{ option.label ?? option.value }}</span>
          <span v-if="option.count !== undefined" data-rig-facet-list-count>{{
            option.count.toLocaleString()
          }}</span>
        </slot>
      </label>
    </div>
    <button
      v-if="foldedCount > 0 || (limit && expanded && filtered.length > limit)"
      type="button"
      data-rig-facet-list-more
      :disabled="disabled"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show fewer' : `Show all (${filtered.length})` }}
    </button>
  </div>
</template>
