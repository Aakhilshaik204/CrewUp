import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.jpeg'],
      manifest: {
        name: 'CrewUp',
        short_name: 'CrewUp',
        description: 'Find sports and gaming activities on campus',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo.jpeg',
            sizes: '192x192 512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
