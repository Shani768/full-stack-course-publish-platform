import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),react()],
  server: {
    fs: {
      strict: false,
    },
  },
  css: {
    devSourcemap: false, // Disable source maps for CSS
  },

})
