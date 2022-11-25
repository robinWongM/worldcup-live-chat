import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'

createApp(App).use(VueClipboard).mount('#app')
