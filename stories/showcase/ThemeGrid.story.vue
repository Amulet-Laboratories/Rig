<script setup lang="ts">
/**
 * Theme Grid — Shows all 4 Hex themes applied to the same component set,
 * rendered side by side in a responsive grid.
 */
import { ref } from 'vue'
import Button from '@core/primitives/Button.vue'
import Input from '@core/primitives/Input.vue'
import Card from '@core/primitives/Card.vue'
import Badge from '@core/primitives/Badge.vue'
import Switch from '@core/primitives/Switch.vue'
import Toggle from '@core/primitives/Toggle.vue'
import Progress from '@core/primitives/Progress.vue'
import Select from '@core/primitives/Select.vue'
import Checkbox from '@core/primitives/Checkbox.vue'
import Label from '@core/primitives/Label.vue'

const themes = [
  { id: 'obelisk', label: 'Obelisk', css: '@hex/themes/obelisk/tokens.css' },
  { id: 'calcite', label: 'Calcite', css: '@hex/themes/calcite/tokens.css' },
  { id: 'obsidian', label: 'Obsidian', css: '@hex/themes/obsidian/tokens.css' },
  { id: 'vscode', label: 'VS Code', css: '@hex/themes/vscode/tokens.css' },
]

const inputValue = ref('Sample text')
const selectValue = ref('option-1')
const switchValue = ref(true)
const toggleValue = ref(false)
const checkValue = ref(true)
const progressValue = ref(65)

const selectOptions = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' },
]
</script>

<template>
  <Story title="Theme Grid" icon="lucide:palette" group="showcase">
    <div class="theme-grid">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="theme-cell"
        :data-theme="theme.id"
      >
        <div class="theme-header">
          <span class="theme-name">{{ theme.label }}</span>
          <Badge>{{ theme.id }}</Badge>
        </div>

        <div class="theme-body">
          <!-- Buttons -->
          <section class="theme-section">
            <h4 class="theme-section-title">Buttons</h4>
            <div class="theme-row">
              <Button variant="primary">Primary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>

          <!-- Inputs -->
          <section class="theme-section">
            <h4 class="theme-section-title">Inputs</h4>
            <Input v-model="inputValue" placeholder="Type here..." />
            <Select v-model="selectValue" :options="selectOptions" />
          </section>

          <!-- Controls -->
          <section class="theme-section">
            <h4 class="theme-section-title">Controls</h4>
            <div class="theme-row">
              <Label>
                <Switch v-model="switchValue" />
                Switch
              </Label>
              <Label>
                <Checkbox v-model="checkValue" />
                Checkbox
              </Label>
              <Toggle v-model="toggleValue" aria-label="Toggle" />
            </div>
          </section>

          <!-- Progress -->
          <section class="theme-section">
            <h4 class="theme-section-title">Progress</h4>
            <Progress :value="progressValue" />
          </section>

          <!-- Card -->
          <section class="theme-section">
            <h4 class="theme-section-title">Card</h4>
            <Card>
              <div class="card-demo">
                <span class="card-title">Sample Card</span>
                <span class="card-desc">Content styled by theme tokens</span>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  </Story>
</template>

<style scoped>
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  padding: 16px;
}

.theme-cell {
  border: 1px solid var(--color-border, #333);
  border-radius: var(--radius, 4px);
  background: var(--color-background, #1a1a1a);
  overflow: hidden;
}

.theme-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border, #333);
  background: var(--color-muted, #262626);
}

.theme-name {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground, #d4d4d4);
}

.theme-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.theme-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.theme-section-title {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted-foreground, #888);
  margin: 0;
}

.theme-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.card-demo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-foreground, #d4d4d4);
}

.card-desc {
  font-size: 12px;
  color: var(--color-muted-foreground, #888);
}
</style>
