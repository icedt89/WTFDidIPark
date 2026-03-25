// Plugins
import components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA as vitePWA } from 'vite-plugin-pwa'
import viteFonts from 'unplugin-fonts/vite'
import { version } from './package.json'
import { ViteMinifyPlugin } from 'vite-plugin-minify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export const alias = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
  '@generators': fileURLToPath(
    new URL('./src/components/generators', import.meta.url)
  ),
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const isProductionBuild = mode === 'production' && command === 'build'

  return {
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      vitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: !isProductionBuild },
        manifest: {
          name: 'WTF did I park?',
          display: 'standalone',
          theme_color: '#141b22',
          background_color: '#141b22',
          lang: 'en',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
      vuetify({
        autoImport: true,
      }),
      // Minify index.html
      isProductionBuild && ViteMinifyPlugin(),
      components(),
      viteFonts({
        fontsource: {
          families: [
            {
              name: 'Roboto',
              weights: [100, 300, 400, 500, 700, 900],
              styles: ['normal', 'italic'],
              subset: 'latin',
            },
          ],
        },
      }),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    resolve: {
      alias,
    },
    server: {
      port: 3006,
    },
    build: {
      sourcemap: !isProductionBuild,
      rolldownOptions: {
        output: {
          minify: {
            compress: {
              dropConsole: isProductionBuild,
              dropDebugger: isProductionBuild,
            },
          },
          comments: !isProductionBuild,
        },
      },
    },
  }
})
