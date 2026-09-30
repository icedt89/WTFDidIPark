import { registerPlugins } from '@/plugins'
import App from '@/App.vue'
import { createApp } from 'vue'
import 'unfonts.css'
import 'maplibre-gl/dist/maplibre-gl.css'
import { setWorkerUrl } from 'maplibre-gl'
import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

setWorkerUrl(mapWorkerUrl)

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
