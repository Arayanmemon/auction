import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'        // <-- Add React plugin
import tailwindcss from '@tailwindcss/vite'     // Tailwind 4 Vite plugin

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://vertex111.com/admin/public',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),          // Enables JSX support
    tailwindcss(),    // Enables Tailwind integration
  ],
})
