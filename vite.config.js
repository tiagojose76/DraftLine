import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // No PWA/service worker inside the Tauri app; the Tauri CLI sets TAURI_ENV_PLATFORM.
  plugins: [
    !process.env.TAURI_ENV_PLATFORM &&
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "DraftLine",
        short_name: "DraftLine",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#319ffe",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,png,svg}"],
        // Xiaolai (CJK) is 12MB; it loads from the network only when needed.
        globIgnores: ["fonts/Xiaolai/**"],
      },
    }),
  ],
});
