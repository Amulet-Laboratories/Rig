import { defineSetupVue3 } from '@histoire/plugin-vue'
import '../styles/base.css'
import '@amulet-laboratories/hex/obelisk'

export const setupVue3 = defineSetupVue3(({ app: _app }) => {
  // Rig structural CSS loaded first (layout, sizing, interaction).
  // Hex obelisk CSS loaded second (colors, fonts, visual styles).
  // Theme switching handled per-story via the useHexTheme composable.
})
