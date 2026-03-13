<script setup lang="ts">
/**
 * Accessibility Showcase — Demonstrates WCAG AAA, ARIA, and keyboard nav
 * across all core Rig components.
 */
import { ref } from 'vue'
import Input from '@core/primitives/Input.vue'
import Switch from '@core/primitives/Switch.vue'
import Checkbox from '@core/primitives/Checkbox.vue'
import RadioGroup from '@core/primitives/RadioGroup.vue'
import Label from '@core/primitives/Label.vue'
import Toggle from '@core/primitives/Toggle.vue'
import Slider from '@core/primitives/Slider.vue'
import Select from '@core/primitives/Select.vue'
import Kbd from '@core/primitives/Kbd.vue'
import List from '@lists/List.vue'
import TreeView from '@lists/TreeView.vue'
import Accordion from '@layout/Accordion.vue'
import ActivityBar from '@nav/ActivityBar.vue'
import type { Action, TreeNode, ListItem } from '@core/types'

// ---- Demo data ----
const switchVal = ref(false)
const checkVal = ref(false)
const toggleVal = ref(false)
const sliderVal = ref(50)
const selectVal = ref('opt-1')
const radioVal = ref('a')
const inputVal = ref('')
const activeActivity = ref('explore')

const selectOptions = [
  { id: 'opt-1', label: 'Option 1' },
  { id: 'opt-2', label: 'Option 2' },
  { id: 'opt-3', label: 'Option 3' },
]

const radioOptions = [
  { label: 'Choice A', value: 'a' },
  { label: 'Choice B', value: 'b' },
  { label: 'Choice C', value: 'c' },
]

const activities: Action[] = [
  { id: 'explore', label: 'Explorer', icon: 'codicon:files' },
  { id: 'search', label: 'Search', icon: 'codicon:search' },
  { id: 'git', label: 'Source Control', icon: 'codicon:source-control' },
]

const treeData: TreeNode[] = [
  {
    id: 'src', label: 'src', icon: 'codicon:folder', children: [
      { id: 'main', label: 'main.ts', icon: 'codicon:file-code' },
      { id: 'app', label: 'App.vue', icon: 'codicon:file-code' },
    ],
  },
  { id: 'readme', label: 'README.md', icon: 'codicon:markdown' },
]

const listItems: ListItem[] = [
  { id: '1', label: 'Navigate with Arrow keys' },
  { id: '2', label: 'Select with Enter or Space' },
  { id: '3', label: 'Jump to start with Home' },
  { id: '4', label: 'Jump to end with End' },
]

const accordionItems = [
  { id: 'focus', title: 'Focus Management', content: 'All interactive elements receive visible focus indicators. Focus is trapped inside modals and follows ARIA dialog patterns.' },
  { id: 'contrast', title: 'Color Contrast', content: 'All text meets WCAG AAA contrast ratios (7:1 for normal text, 4.5:1 for large text) against their background.' },
  { id: 'roles', title: 'ARIA Roles', content: 'Semantic roles like role="tablist", role="tree", role="menubar" are applied automatically. No manual ARIA wiring needed.' },
  { id: 'keyboard', title: 'Keyboard Navigation', content: 'Arrow keys, Enter, Escape, Home, End — all standard keyboard interactions work out of the box.' },
]
</script>

<template>
  <Story title="Accessibility" icon="lucide:accessibility" group="showcase">
    <div class="a11y-showcase">
      <header class="a11y-header">
        <h2 class="a11y-title">Accessibility</h2>
        <p class="a11y-desc">
          Every Rig component is keyboard-navigable, ARIA-compliant, and designed for
          WCAG AAA contrast. Tab through the page to verify focus management.
        </p>
      </header>

      <div class="a11y-grid">
        <!-- Form controls -->
        <section class="a11y-section">
          <h3 class="a11y-section-title">Form Controls</h3>
          <p class="a11y-hint">
            <Kbd>Tab</Kbd> between controls.
            <Kbd>Space</Kbd> to toggle. <Kbd>Enter</Kbd> to activate.
          </p>

          <div class="a11y-form">
            <Label>
              Text input
              <Input v-model="inputVal" placeholder="Type something..." aria-describedby="input-help" />
            </Label>
            <span id="input-help" class="a11y-help">Accessible help text linked via aria-describedby</span>

            <Label>
              Select
              <Select v-model="selectVal" :options="selectOptions" />
            </Label>

            <Label>
              <Switch v-model="switchVal" />
              Switch ({{ switchVal ? 'on' : 'off' }})
            </Label>

            <Label>
              <Checkbox v-model="checkVal" aria-label="Checkbox demo" />
              Checkbox ({{ checkVal ? 'checked' : 'unchecked' }})
            </Label>

            <Label>
              <Toggle v-model="toggleVal" aria-label="Bold" />
              Toggle
            </Label>

            <Label>
              Slider: {{ sliderVal }}
              <Slider v-model="sliderVal" :min="0" :max="100" aria-label="Volume" />
            </Label>

            <fieldset class="a11y-fieldset">
              <legend class="a11y-legend">Radio Group</legend>
              <RadioGroup v-model="radioVal" :options="radioOptions" name="demo-radio" />
            </fieldset>
          </div>
        </section>

        <!-- Keyboard patterns -->
        <section class="a11y-section">
          <h3 class="a11y-section-title">Keyboard Patterns</h3>

          <div class="a11y-pattern">
            <h4 class="a11y-pattern-title">Activity Bar</h4>
            <p class="a11y-hint">
              <Kbd>&#8593;</Kbd><Kbd>&#8595;</Kbd> to navigate.
              <Kbd>Home</Kbd>/<Kbd>End</Kbd> to jump.
            </p>
            <ActivityBar v-model:active-id="activeActivity" :items="activities" />
          </div>

          <div class="a11y-pattern">
            <h4 class="a11y-pattern-title">List</h4>
            <p class="a11y-hint">
              <Kbd>&#8593;</Kbd><Kbd>&#8595;</Kbd> arrows, <Kbd>Enter</Kbd> to select.
            </p>
            <List :items="listItems" aria-label="Demo list" />
          </div>

          <div class="a11y-pattern">
            <h4 class="a11y-pattern-title">Tree View</h4>
            <p class="a11y-hint">
              <Kbd>&#8592;</Kbd><Kbd>&#8594;</Kbd> to expand/collapse.
              <Kbd>&#8593;</Kbd><Kbd>&#8595;</Kbd> to move.
            </p>
            <TreeView :nodes="treeData" />
          </div>
        </section>

        <!-- Accordion docs -->
        <section class="a11y-section a11y-section-full">
          <h3 class="a11y-section-title">ARIA Patterns</h3>
          <p class="a11y-hint">
            <Kbd>Enter</Kbd>/<Kbd>Space</Kbd> to expand.
            <Kbd>&#8593;</Kbd><Kbd>&#8595;</Kbd> between headers.
          </p>
          <Accordion collapsible>
            <template #default="{ isOpen, toggle, headerId, panelId }">
              <div v-for="item in accordionItems" :key="item.id" class="a11y-accordion-item">
                <button
                  :id="headerId(item.id)"
                  data-rig-accordion-trigger
                  class="a11y-accordion-trigger"
                  :aria-expanded="isOpen(item.id)"
                  :aria-controls="panelId(item.id)"
                  @click="toggle(item.id)"
                >
                  {{ item.title }}
                </button>
                <div
                  v-show="isOpen(item.id)"
                  :id="panelId(item.id)"
                  role="region"
                  :aria-labelledby="headerId(item.id)"
                  class="a11y-accordion-panel"
                >
                  {{ item.content }}
                </div>
              </div>
            </template>
          </Accordion>
        </section>
      </div>
    </div>
  </Story>
</template>

<style scoped>
.a11y-showcase {
  padding: 16px;
  max-width: 960px;
}

.a11y-header {
  margin-bottom: 24px;
}

.a11y-title {
  font-family: var(--font-mono, monospace);
  font-size: 18px;
  color: var(--color-foreground, #d4d4d4);
  margin: 0 0 8px;
}

.a11y-desc {
  font-size: 13px;
  color: var(--color-muted-foreground, #888);
  margin: 0;
  line-height: 1.5;
}

.a11y-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
}

.a11y-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.a11y-section-full {
  grid-column: 1 / -1;
}

.a11y-section-title {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary, #c9956d);
  margin: 0;
}

.a11y-hint {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.a11y-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.a11y-help {
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
  font-style: italic;
}

.a11y-fieldset {
  border: 1px solid var(--color-border, #333);
  border-radius: var(--radius, 4px);
  padding: 12px;
  margin: 0;
}

.a11y-legend {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-muted-foreground, #888);
  padding: 0 4px;
}

.a11y-pattern {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--color-border, #333);
  border-radius: var(--radius, 4px);
}

.a11y-pattern-title {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  color: var(--color-foreground, #d4d4d4);
  margin: 0;
}

.a11y-accordion-item {
  border-bottom: 1px solid var(--color-border, #333);
}

.a11y-accordion-trigger {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: none;
  border: none;
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  color: var(--color-foreground, #d4d4d4);
  cursor: pointer;
}

.a11y-accordion-trigger:hover {
  background: var(--color-muted, #262626);
}

.a11y-accordion-trigger:focus-visible {
  outline: 2px solid var(--color-ring, #c9956d);
  outline-offset: -2px;
}

.a11y-accordion-panel {
  padding: 8px 12px 12px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-muted-foreground, #888);
}
</style>
