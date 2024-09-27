import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'EduZona',
        short_name: 'EduZona',
        description: 'Mi increíble aplicación React con soporte PWA y Vite',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'img/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Ajustar el tamaño máximo a 5 MB
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Agrupa todos los módulos de node_modules en un chunk llamado "vendor"
          }
          // Puedes agregar más agrupaciones aquí si es necesario
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Ajusta el límite de advertencia de tamaño de chunk
  },
});
