import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt", // Changed from "autoUpdate" to enable useRegisterSW hook
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"], // Cache de tudo o que é crítico
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith(".json"),
            handler: "StaleWhileRevalidate", // Usa a cache mas atualiza em background se houver rede
            options: {
              cacheName: "game-data-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 1 semana
            },
          },
        ],
      },
      manifest: {
        name: "Board Game Assistant",
        short_name: "BGAssist",
        description: "Gestor de pontuações offline para jogos de tabuleiro",
        theme_color: "#2563eb",
        background_color: "#f1f5f9",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
