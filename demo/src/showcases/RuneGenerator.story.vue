<script setup lang="ts">
/**
 * Rune Generator — Creative tool showcase
 * Theme: Obelisk dark | Exercises: core, layout, extras, nav
 */
import { ref, computed } from 'vue'

// ---- Rig Components ----
import Button from '@core/primitives/Button.vue'
import Card from '@core/primitives/Card.vue'
import Icon from '@core/primitives/Icon.vue'
import Input from '@core/primitives/Input.vue'
import Select from '@core/primitives/Select.vue'
import Slider from '@core/primitives/Slider.vue'
import Checkbox from '@core/primitives/Checkbox.vue'
import Label from '@core/primitives/Label.vue'
import IconButton from '@core/primitives/IconButton.vue'
import Tabs from '@nav/Tabs.vue'
import SplitView from '@layout/SplitView.vue'
import Toast from '@extras/Toast.vue'
import { toast } from '@extras/useToast'

// ---- Engine & Data ----
import { generateRuneSVG, type RuneConfig } from './fixtures/rune-engine'
import {
  presets,
  palettes,
  defaultConfig,
  symmetryOptions,
  exportFormats,
  type Preset,
} from './fixtures/rune-data'

// ---------------------------------------------------------------------------
// Config state
// ---------------------------------------------------------------------------
const config = ref<RuneConfig>({ ...defaultConfig })

// ---------------------------------------------------------------------------
// View state
// ---------------------------------------------------------------------------
const controlTab = ref('shape')
const controlTabs = [
  { id: 'shape', label: 'Shape', icon: 'codicon:symbol-misc' },
  { id: 'color', label: 'Color', icon: 'codicon:symbol-color' },
  { id: 'export', label: 'Export', icon: 'codicon:export' },
]

const splitSizes = ref([35, 65])
const controlsCollapsed = ref(false)
const exportModalOpen = ref(false)
const galleryMode = ref(false)

// ---------------------------------------------------------------------------
// SVG output (reactive)
// ---------------------------------------------------------------------------
const svgOutput = computed(() => generateRuneSVG(config.value, 400))

// ---------------------------------------------------------------------------
// Preset handling
// ---------------------------------------------------------------------------
function loadPreset(preset: Preset) {
  config.value = { ...preset.config }
  toast.add({ message: `Loaded "${preset.name}"`, variant: 'info', duration: 2000 })
}

// ---------------------------------------------------------------------------
// Palette selection
// ---------------------------------------------------------------------------
const activePaletteId = ref('bronze')

function selectPalette(id: string) {
  activePaletteId.value = id
  const palette = palettes[id]
  if (palette) config.value.palette = [...palette.colors]
}

// ---------------------------------------------------------------------------
// Export actions
// ---------------------------------------------------------------------------
function handleExport(formatId: string) {
  if (formatId === 'svg') {
    const blob = new Blob([svgOutput.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rune-${config.value.seed}.svg`
    a.click()
    URL.revokeObjectURL(url)
    toast.add({ message: 'SVG downloaded', variant: 'success' })
  } else if (formatId === 'copy') {
    navigator.clipboard?.writeText(svgOutput.value).then(() => {
      toast.add({ message: 'SVG markup copied to clipboard', variant: 'success' })
    }).catch(() => {
      toast.add({ message: 'Copy failed — try the download option', variant: 'error' })
    })
  } else if (formatId === 'png') {
    toast.add({ message: 'PNG export coming soon', variant: 'info' })
  }
  exportModalOpen.value = false
}

// ---------------------------------------------------------------------------
// Randomize seed
// ---------------------------------------------------------------------------
function randomizeSeed() {
  const words = ['storm', 'ember', 'tide', 'frost', 'shadow', 'root', 'iron', 'silver', 'dawn', 'dusk', 'veil', 'thorn', 'ash', 'bone', 'rune', 'glyph', 'ward', 'mark', 'seal', 'sigil']
  const w1 = words[Math.floor(Math.random() * words.length)]
  const w2 = words[Math.floor(Math.random() * words.length)]
  const n = Math.floor(Math.random() * 100)
  config.value.seed = `${w1}-${w2}-${n}`
}
</script>

<template>
  <Story title="Rune Generator" icon="codicon:wand" group="showcase">
    <Variant title="Default">
      <div class="rune-shell" data-theme="obelisk">
        <!-- Gallery mode -->
        <template v-if="galleryMode">
          <header class="rune-topbar">
            <div class="rune-topbar-left">
              <Icon icon="codicon:wand" size="lg" label="Rune Generator" />
              <span class="rune-brand">Rune Generator</span>
            </div>
            <Button variant="ghost" size="sm" @click="galleryMode = false">
              <Icon icon="codicon:arrow-left" size="sm" />
              Back to Editor
            </Button>
          </header>
          <div class="rune-gallery">
            <Card
              v-for="preset in presets"
              :key="preset.name"
              interactive
              @click="loadPreset(preset); galleryMode = false"
            >
              <div class="gallery-card">
                <!-- eslint-disable vue/no-v-html -->
                <div class="gallery-preview" v-html="generateRuneSVG(preset.config, 200)" />
                <span class="gallery-name">{{ preset.name }}</span>
                <span class="gallery-desc">{{ preset.description }}</span>
              </div>
            </Card>
          </div>
        </template>

        <!-- Editor mode -->
        <template v-else>
          <header class="rune-topbar">
            <div class="rune-topbar-left">
              <Icon icon="codicon:wand" size="lg" label="Rune Generator" />
              <span class="rune-brand">Rune Generator</span>
            </div>
            <div class="rune-topbar-right">
              <Button variant="ghost" size="sm" @click="galleryMode = true">
                <Icon icon="codicon:symbol-misc" size="sm" />
                Gallery
              </Button>
              <Button variant="ghost" size="sm" @click="controlsCollapsed = !controlsCollapsed">
                <Icon :icon="controlsCollapsed ? 'codicon:panel-left' : 'codicon:panel-right'" size="sm" />
                {{ controlsCollapsed ? 'Show Controls' : 'Hide Controls' }}
              </Button>
            </div>
          </header>

          <div class="rune-editor">
            <SplitView
              v-if="!controlsCollapsed"
              orientation="horizontal"
              :sizes="splitSizes"
              :min-sizes="[25, 40]"
              @update:sizes="splitSizes = $event"
            >
              <!-- Controls panel -->
              <template #pane-0>
                <div class="rune-controls">
                  <Tabs v-model="controlTab">
                    <template #tabs="{ isActive, activate }">
                      <button
                        v-for="tab in controlTabs"
                        :key="tab.id"
                        role="tab"
                        :data-tab-id="tab.id"
                        :aria-selected="isActive(tab.id)"
                        :tabindex="isActive(tab.id) ? 0 : -1"
                        :data-active="isActive(tab.id) || undefined"
                        class="rune-tab"
                        @click="activate(tab.id)"
                      >
                        <Icon :icon="tab.icon" size="sm" />
                        {{ tab.label }}
                      </button>
                    </template>

                    <template #default="{ activeId }">
                      <!-- Shape controls -->
                      <div v-if="activeId === 'shape'" class="control-section">
                        <div class="control-group">
                          <label class="control-label" for="rune-seed">Seed</label>
                          <div class="seed-row">
                            <Input id="rune-seed" v-model="config.seed" placeholder="Enter a seed..." />
                            <IconButton icon="codicon:refresh" ariaLabel="Randomize" @click="randomizeSeed" />
                          </div>
                        </div>

                        <div class="control-group">
                          <label class="control-label" for="rune-segments">Segments ({{ config.segments }})</label>
                          <Slider id="rune-segments" v-model="config.segments" :min="3" :max="12" :step="1" aria-label="Segments" />
                        </div>

                        <div class="control-group">
                          <label class="control-label" for="rune-layers">Layers ({{ config.layers }})</label>
                          <Slider id="rune-layers" v-model="config.layers" :min="1" :max="4" :step="1" aria-label="Layers" />
                        </div>

                        <div class="control-group">
                          <label class="control-label" for="rune-symmetry">Symmetry</label>
                          <Select id="rune-symmetry" v-model="config.symmetry" :options="symmetryOptions" aria-label="Symmetry" />
                        </div>

                        <div class="control-group">
                          <label class="control-label" for="rune-complexity">Complexity ({{ config.complexity }})</label>
                          <Slider id="rune-complexity" v-model="config.complexity" :min="1" :max="10" :step="1" aria-label="Complexity" />
                        </div>

                        <div class="control-group">
                          <label class="control-label" for="rune-inner-radius">Inner Radius ({{ config.innerRadius.toFixed(2) }})</label>
                          <Slider id="rune-inner-radius" v-model="config.innerRadius" :min="0.1" :max="0.5" :step="0.05" aria-label="Inner radius" />
                        </div>

                        <div class="control-group">
                          <label class="control-label" for="rune-stroke-weight">Stroke Weight ({{ config.strokeWeight }})</label>
                          <Slider id="rune-stroke-weight" v-model="config.strokeWeight" :min="1" :max="5" :step="0.5" aria-label="Stroke weight" />
                        </div>

                        <div class="control-group">
                          <Label>
                            <Checkbox v-model="config.showGuides" aria-label="Show construction guides" />
                            Show Construction Guides
                          </Label>
                        </div>

                        <div class="preset-section">
                          <span class="control-label">Presets</span>
                          <div class="preset-grid">
                            <Button
                              v-for="preset in presets"
                              :key="preset.name"
                              variant="ghost"
                              size="sm"
                              @click="loadPreset(preset)"
                            >
                              {{ preset.name }}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <!-- Color controls -->
                      <div v-if="activeId === 'color'" class="control-section">
                        <span class="control-label">Palette</span>
                        <div class="palette-grid">
                          <button
                            v-for="(pal, id) in palettes"
                            :key="id"
                            class="palette-swatch-group"
                            :class="{ active: activePaletteId === id }"
                            @click="selectPalette(id as string)"
                          >
                            <div class="swatch-row">
                              <span
                                v-for="color in pal.colors"
                                :key="color"
                                class="swatch"
                                :style="{ backgroundColor: color }"
                              />
                            </div>
                            <span class="palette-name">{{ pal.name }}</span>
                          </button>
                        </div>

                        <div class="control-group" style="margin-top: 16px">
                          <span class="control-label">Active Colors</span>
                          <div class="active-colors">
                            <span
                              v-for="color in config.palette"
                              :key="color"
                              class="active-swatch"
                              :style="{ backgroundColor: color }"
                              :title="color"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Export controls -->
                      <div v-if="activeId === 'export'" class="control-section">
                        <p class="export-intro">
                          Export your rune in the format you need.
                        </p>
                        <div class="export-buttons">
                          <Button
                            v-for="fmt in exportFormats"
                            :key="fmt.id"
                            variant="ghost"
                            @click="handleExport(fmt.id)"
                          >
                            <Icon :icon="fmt.icon" size="sm" />
                            {{ fmt.label }}
                          </Button>
                        </div>

                        <div class="config-summary">
                          <span class="control-label">Current Config</span>
                          <pre class="config-json">{{ JSON.stringify(config, null, 2) }}</pre>
                        </div>
                      </div>
                    </template>
                  </Tabs>
                </div>
              </template>

              <!-- Canvas -->
              <template #pane-1>
                <div class="rune-canvas">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="canvas-inner" v-html="svgOutput" />
                </div>
              </template>
            </SplitView>

            <!-- Collapsed: canvas only -->
            <div v-else class="rune-canvas">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="canvas-inner" v-html="svgOutput" />
            </div>
          </div>
        </template>

        <!-- Toast -->
        <Toast />
      </div>
    </Variant>
  </Story>
</template>

<style scoped>
/* ---- Shell ---- */
.rune-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 600px;
  background: var(--color-background, #0f0d0a);
  color: var(--color-foreground, #f5f1ed);
  font-family: var(--font-sans, Inter, sans-serif);
}

/* ---- Topbar ---- */
.rune-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border, #333);
  background: var(--color-card, #1a1714);
  gap: 16px;
}

.rune-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rune-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rune-brand {
  font-family: var(--font-mono, monospace);
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.02em;
}

/* ---- Editor layout ---- */
.rune-editor {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ---- Controls ---- */
.rune-controls {
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid var(--color-border, #333);
  background: var(--color-card, #1a1714);
}

.rune-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  background: none;
  color: var(--color-muted-foreground, #8a8078);
  font-family: var(--font-sans, sans-serif);
  font-size: 12px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.rune-tab[data-active] {
  color: var(--color-foreground, #f5f1ed);
  border-bottom-color: var(--color-primary, #c9956d);
}

.control-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  font-size: 11px;
  color: var(--color-muted-foreground, #8a8078);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.seed-row {
  display: flex;
  gap: 6px;
}

/* ---- Presets ---- */
.preset-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border, #333);
}

.preset-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* ---- Palette ---- */
.palette-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.palette-swatch-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--color-border, #333);
  border-radius: var(--radius, 4px);
  background: none;
  cursor: pointer;
  transition: border-color 0.15s;
  color: var(--color-foreground);
}

.palette-swatch-group:hover,
.palette-swatch-group.active {
  border-color: var(--color-primary, #c9956d);
}

.swatch-row {
  display: flex;
  gap: 3px;
}

.swatch {
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.palette-name {
  font-size: 11px;
  color: var(--color-muted-foreground, #8a8078);
}

.active-colors {
  display: flex;
  gap: 6px;
}

.active-swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--radius, 4px);
  border: 1px solid var(--color-border, #333);
}

/* ---- Export ---- */
.export-intro {
  font-size: 13px;
  color: var(--color-muted-foreground, #8a8078);
  margin: 0;
}

.export-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border, #333);
}

.config-json {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  color: var(--color-muted-foreground, #8a8078);
  background: var(--color-background, #0f0d0a);
  padding: 8px;
  border-radius: var(--radius, 4px);
  overflow-x: auto;
  margin: 0;
}

/* ---- Canvas ---- */
.rune-canvas {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background, #0f0d0a);
  overflow: hidden;
}

.canvas-inner {
  max-width: 100%;
  max-height: 100%;
  color: var(--color-muted-foreground, #8a8078);
}

.canvas-inner :deep(svg) {
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 400px;
}

/* ---- Gallery ---- */
.rune-gallery {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 24px;
  overflow-y: auto;
  align-content: start;
}

.gallery-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.gallery-preview {
  color: var(--color-muted-foreground, #8a8078);
}

.gallery-preview :deep(svg) {
  width: 200px;
  height: 200px;
}

.gallery-name {
  font-weight: 600;
  font-size: 14px;
}

.gallery-desc {
  font-size: 12px;
  color: var(--color-muted-foreground, #8a8078);
  text-align: center;
  line-height: 1.4;
}
</style>
