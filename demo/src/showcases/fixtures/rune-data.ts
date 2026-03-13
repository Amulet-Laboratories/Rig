/**
 * Rune Generator — Mock presets and palette data
 * Theme: Obelisk dark | Archetype: Creative tool
 */
import type { RuneConfig } from './rune-engine'

// ---------------------------------------------------------------------------
// Palettes (drawn from Hex token sets)
// ---------------------------------------------------------------------------

export const palettes: Record<string, { name: string; colors: string[] }> = {
  bronze: {
    name: 'Bronze',
    colors: ['#c9956d', '#a0714a', '#7d5639', '#5c3f2b'],
  },
  silver: {
    name: 'Silver',
    colors: ['#c0c0c0', '#a0a0a0', '#808080', '#606060'],
  },
  rose: {
    name: 'Rose',
    colors: ['#e8a0a0', '#d47070', '#b04040', '#8c2020'],
  },
  azure: {
    name: 'Azure',
    colors: ['#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
  },
  emerald: {
    name: 'Emerald',
    colors: ['#6ee7b7', '#34d399', '#10b981', '#059669'],
  },
  parchment: {
    name: 'Parchment',
    colors: ['#f5f1ed', '#d4cfc8', '#b5afa6', '#8a8078'],
  },
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export interface Preset {
  name: string
  config: RuneConfig
  description: string
}

export const presets: Preset[] = [
  {
    name: 'Warding Sigil',
    description: 'Protective rune with high symmetry and dense construction. Used to mark safe passages.',
    config: {
      seed: 'ward-of-passage',
      segments: 8,
      layers: 3,
      symmetry: 'radial',
      strokeWeight: 2,
      palette: palettes.bronze!.colors,
      innerRadius: 0.2,
      complexity: 6,
      showGuides: false,
    },
  },
  {
    name: 'Navigation Mark',
    description: 'Compass-like rune with cardinal emphasis. Carved into waystone pillars along trade routes.',
    config: {
      seed: 'north-star-bearing',
      segments: 4,
      layers: 2,
      symmetry: 'radial',
      strokeWeight: 2.5,
      palette: palettes.silver!.colors,
      innerRadius: 0.3,
      complexity: 4,
      showGuides: false,
    },
  },
  {
    name: 'Clan Seal',
    description: 'Bilateral heraldic mark with organic curves. Each clan produces a unique seal from their name.',
    config: {
      seed: 'house-thornwick',
      segments: 6,
      layers: 2,
      symmetry: 'bilateral',
      strokeWeight: 2,
      palette: palettes.rose!.colors,
      innerRadius: 0.25,
      complexity: 7,
      showGuides: false,
    },
  },
  {
    name: 'Storm Glyph',
    description: 'Chaotic, asymmetric pattern channeling elemental energy. Found etched into lightning rods.',
    config: {
      seed: 'thunderclap-echo',
      segments: 12,
      layers: 4,
      symmetry: 'none',
      strokeWeight: 1.5,
      palette: palettes.azure!.colors,
      innerRadius: 0.15,
      complexity: 9,
      showGuides: false,
    },
  },
  {
    name: 'Growth Ring',
    description: 'Nature-aligned rune with layered organic forms. Druids inscribe these on living trees.',
    config: {
      seed: 'verdant-spiral',
      segments: 5,
      layers: 3,
      symmetry: 'radial',
      strokeWeight: 2,
      palette: palettes.emerald!.colors,
      innerRadius: 0.35,
      complexity: 5,
      showGuides: false,
    },
  },
  {
    name: 'Scribe Cipher',
    description: 'Minimal scholarly mark used as a signature seal. Clean lines, low complexity.',
    config: {
      seed: 'ink-and-quill',
      segments: 6,
      layers: 1,
      symmetry: 'radial',
      strokeWeight: 1.5,
      palette: palettes.parchment!.colors,
      innerRadius: 0.4,
      complexity: 3,
      showGuides: false,
    },
  },
]

// ---------------------------------------------------------------------------
// Default config
// ---------------------------------------------------------------------------

export const defaultConfig: RuneConfig = { ...presets[0]!.config }

// ---------------------------------------------------------------------------
// Symmetry options (for Select)
// ---------------------------------------------------------------------------

export const symmetryOptions = [
  { id: 'radial', label: 'Radial' },
  { id: 'bilateral', label: 'Bilateral' },
  { id: 'none', label: 'None' },
]

// ---------------------------------------------------------------------------
// Export format options
// ---------------------------------------------------------------------------

export const exportFormats = [
  { id: 'svg', label: 'SVG File', icon: 'codicon:file-code' },
  { id: 'png', label: 'PNG Image', icon: 'codicon:file-media' },
  { id: 'copy', label: 'Copy Markup', icon: 'codicon:copy' },
]
