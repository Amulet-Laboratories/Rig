<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Current color in hex format */
    modelValue?: string
  }>(),
  {
    modelValue: '#c9956d',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const hexInput = ref(props.modelValue)
const hue = ref(0)
const saturation = ref(50)
const lightness = ref(50)

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 50, 50]
  const r = parseInt(result[1]!, 16) / 255
  const g = parseInt(result[2]!, 16) / 255
  const b = parseInt(result[3]!, 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100
  const ll = l / 100
  const a = sl * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function syncFromHex(hex: string) {
  const [h, s, l] = hexToHsl(hex)
  hue.value = h
  saturation.value = s
  lightness.value = l
}

syncFromHex(props.modelValue)

function onHueChange(e: Event) {
  hue.value = parseInt((e.target as HTMLInputElement).value, 10)
  emitColor()
}

function onSaturationChange(e: Event) {
  saturation.value = parseInt((e.target as HTMLInputElement).value, 10)
  emitColor()
}

function onLightnessChange(e: Event) {
  lightness.value = parseInt((e.target as HTMLInputElement).value, 10)
  emitColor()
}

function onHexInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  hexInput.value = val
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    syncFromHex(val)
    emit('update:modelValue', val)
  }
}

function emitColor() {
  const hex = hslToHex(hue.value, saturation.value, lightness.value)
  hexInput.value = hex
  emit('update:modelValue', hex)
}

watch(
  () => props.modelValue,
  (val) => {
    hexInput.value = val
    syncFromHex(val)
  },
)
</script>

<template>
  <div data-rig-color-picker tabindex="0" @keydown.stop>
    <div
      data-rig-color-picker-preview
      :style="{ backgroundColor: hexInput }"
      role="img"
      :aria-label="`Selected color: ${hexInput}`"
    />

    <div data-rig-color-picker-sliders>
      <label data-rig-color-picker-field>
        <span>H</span>
        <input
          type="range"
          min="0"
          max="360"
          :value="hue"
          data-rig-color-picker-hue
          aria-label="Hue"
          @input="onHueChange"
        />
      </label>
      <label data-rig-color-picker-field>
        <span>S</span>
        <input
          type="range"
          min="0"
          max="100"
          :value="saturation"
          data-rig-color-picker-saturation
          aria-label="Saturation"
          @input="onSaturationChange"
        />
      </label>
      <label data-rig-color-picker-field>
        <span>L</span>
        <input
          type="range"
          min="0"
          max="100"
          :value="lightness"
          data-rig-color-picker-lightness
          aria-label="Lightness"
          @input="onLightnessChange"
        />
      </label>
    </div>

    <div data-rig-color-picker-hex>
      <label>
        <span>Hex</span>
        <input
          type="text"
          :value="hexInput"
          data-rig-color-picker-input
          aria-label="Hex color value"
          @input="onHexInput"
        />
      </label>
    </div>
  </div>
</template>
