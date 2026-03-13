import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import Story from './shims/Story.vue'
import Variant from './shims/Variant.vue'

// Rig structural CSS (layout, sizing — no colors)
import '@rig/styles/base.css'

// Hex theme — loaded dynamically via <link> tag (see useTheme.ts)
import './useTheme'

// Showcase shared component styles
import './showcases/components/showcase.css'

const app = createApp(App)

// Register Histoire shims globally so .story.vue files render
app.component('Story', Story)
app.component('Variant', Variant)

app.use(router)
app.mount('#app')
