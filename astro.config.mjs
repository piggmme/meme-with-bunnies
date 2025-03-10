// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import cloudflare from '@astrojs/cloudflare'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: cloudflare(),
  vite: {
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    },
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./global.scss" as *;`,
        },
      },
    },
  },
})
