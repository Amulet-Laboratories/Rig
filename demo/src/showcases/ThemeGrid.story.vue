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
import Combobox from '@core/primitives/Combobox.vue'
import Divider from '@core/primitives/Divider.vue'
import Radio from '@core/primitives/Radio.vue'
import TagInput from '@core/primitives/TagInput.vue'
import Textarea from '@core/primitives/Textarea.vue'
import ToggleGroup from '@core/primitives/ToggleGroup.vue'
import Slider from '@core/primitives/Slider.vue'
import Skeleton from '@extras/Skeleton.vue'

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
const textareaValue = ref('Multi-line text content\nwith a second line.')
const tags = ref(['design', 'tokens', 'hex'])
const radioValue = ref('a')
const comboValue = ref<string | null>('opt-1')
const toggleGroupValue = ref('grid')
const sliderValue = ref(50)

const selectOptions = [
  { id: 'option-1', label: 'Option 1' },
  { id: 'option-2', label: 'Option 2' },
  { id: 'option-3', label: 'Option 3' },
]

const comboOptions = [
  { id: 'opt-1', label: 'Obelisk', description: 'Dark warm' },
  { id: 'opt-2', label: 'Calcite', description: 'Light warm' },
  { id: 'opt-3', label: 'Obsidian', description: 'High contrast' },
]

const tagSuggestions = ['design', 'tokens', 'hex', 'theme', 'dark', 'light', 'a11y']
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
            <Select v-model="selectValue" :options="selectOptions" aria-label="Theme option" />
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
                <Checkbox v-model="checkValue" aria-label="Checkbox" />
                Checkbox
              </Label>
              <Toggle v-model="toggleValue" aria-label="Toggle" />
            </div>
          </section>

          <Divider />

          <!-- Radio -->
          <section class="theme-section">
            <h4 class="theme-section-title">Radio</h4>
            <div class="theme-row">
              <Label>
                <Radio v-model="radioValue" value="a" name="theme-radio" aria-label="Option A" />
                Option A
              </Label>
              <Label>
                <Radio v-model="radioValue" value="b" name="theme-radio" aria-label="Option B" />
                Option B
              </Label>
              <Label>
                <Radio v-model="radioValue" value="c" name="theme-radio" aria-label="Option C" />
                Option C
              </Label>
            </div>
          </section>

          <!-- Slider -->
          <section class="theme-section">
            <h4 class="theme-section-title">Slider</h4>
            <Slider v-model="sliderValue" :min="0" :max="100" aria-label="Theme slider" />
          </section>

          <!-- Toggle Group -->
          <section class="theme-section">
            <h4 class="theme-section-title">Toggle Group</h4>
            <ToggleGroup v-model="toggleGroupValue" type="single">
              <template #default="{ isPressed, toggle }">
                <Toggle :modelValue="isPressed('grid')" aria-label="Grid" @update:modelValue="toggle('grid')">Grid</Toggle>
                <Toggle :modelValue="isPressed('list')" aria-label="List" @update:modelValue="toggle('list')">List</Toggle>
                <Toggle :modelValue="isPressed('table')" aria-label="Table" @update:modelValue="toggle('table')">Table</Toggle>
              </template>
            </ToggleGroup>
          </section>

          <Divider label="Extended" />

          <!-- Textarea -->
          <section class="theme-section">
            <h4 class="theme-section-title">Textarea</h4>
            <Textarea v-model="textareaValue" :rows="3" placeholder="Multi-line input..." />
          </section>

          <!-- Combobox -->
          <section class="theme-section">
            <h4 class="theme-section-title">Combobox</h4>
            <Combobox v-model="comboValue" :options="comboOptions" placeholder="Search themes..." />
          </section>

          <!-- Tag Input -->
          <section class="theme-section">
            <h4 class="theme-section-title">Tag Input</h4>
            <TagInput v-model="tags" :suggestions="tagSuggestions" placeholder="Add tag..." aria-label="Tags" />
          </section>

          <!-- Progress -->
          <section class="theme-section">
            <h4 class="theme-section-title">Progress</h4>
            <Progress :value="progressValue" aria-label="Progress" />
          </section>

          <!-- Skeleton -->
          <section class="theme-section">
            <h4 class="theme-section-title">Skeleton</h4>
            <Skeleton :lines="3" :width="['100%', '80%', '60%']" />
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
