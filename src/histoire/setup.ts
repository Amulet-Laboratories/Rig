import { defineSetupVue3 } from '@histoire/plugin-vue'
import StoryWrapper from './StoryWrapper.vue'
import '../styles/base.css'
import '../styles/scaffold.css'

export const setupVue3 = defineSetupVue3(({ addWrapper }) => {
  // Structural CSS (layout, sizing) + scaffold (monochrome defaults).
  // StoryWrapper provides consistent padding on every story.
  addWrapper(StoryWrapper)
})
