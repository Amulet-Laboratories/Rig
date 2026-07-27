import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/main.css'
import '@/lib/icons-bundle'
import { installGlobalImageFallback } from '@/lib/demoPlaceholder'

installGlobalImageFallback()

createApp(App).use(router).mount('#app')
