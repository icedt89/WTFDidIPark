import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: {
        ...minimal2023Preset.maskable?.resizeOptions,
        background: '#141b22',
      },
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: {
        ...minimal2023Preset.apple?.resizeOptions,
        background: '#141b22',
      },
    },
    transparent: {
      ...minimal2023Preset.transparent,
      resizeOptions: {
        ...minimal2023Preset.transparent?.resizeOptions,
        background: '#141b22',
      },
    },
  },
  images: ['public/logo.svg'],
})
