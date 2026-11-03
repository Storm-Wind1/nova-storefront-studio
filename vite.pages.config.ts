import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Separate client-only target: GitHub Pages cannot run the Start/Nitro server.
export default defineConfig({
  root: fileURLToPath(new URL("./pages", import.meta.url)),
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  base: process.env["PAGES_BASE_PATH"] || "/nova-storefront-studio/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  define: {
    "import.meta.env.VITE_GITHUB_PAGES": JSON.stringify("true"),
    "import.meta.env.VITE_SITE_URL": JSON.stringify(process.env["PAGES_SITE_URL"] || "https://storm-wind1.github.io/nova-storefront-studio/"),
  },
  build: {
    outDir: fileURLToPath(new URL("./dist-pages", import.meta.url)),
    emptyOutDir: true,
  },
});
