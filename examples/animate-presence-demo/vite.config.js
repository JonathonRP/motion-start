import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ['motion-start', 'framesync', 'popmotion', 'style-value-types']
  }
})
