import { registerPlugins } from '@/plugins'
import App from '@/App.vue'
import { createApp } from 'vue'
import 'unfonts.css'
import 'leaflet/dist/leaflet.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
