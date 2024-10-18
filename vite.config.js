import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ['favicon.ico', "apple-touch-icon.png", "masked-icon.png"],
  manifest: {
    name: "EduZona",
    short_name: "EduZona",
    description: "EduZona",
    icons: [
      {
        src: "./icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },
      {
        src: "./icon-144x144.png",
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: "./icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    
    theme_color: "#181818",
    background_color: "#00314A", 
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",

    screenshots: [
      {
        src: "./screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "./screenshot-mobile.png",
        sizes: "720x1280",
        type: "image/png"
      }
    ]
    
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      ...manifestForPlugin,
      workbox: {
        maximumFileSizeToCacheInBytes: 3145728, // Ajusta según tus necesidades
      },
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Ajusta el límite de advertencia de tamaño de chunk
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Agrupa todas las dependencias en un chunk
          }
          // Agrega más condiciones si es necesario
        }
      }
    }
  }
});
