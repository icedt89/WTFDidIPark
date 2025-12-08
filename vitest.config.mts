import { alias } from './vite.config.mjs'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias,
    extensions: ['.ts'],
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
