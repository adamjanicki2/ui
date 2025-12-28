import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), svgr(), eslint({ lintOnStart: true })],
  base: "/ui/",
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      "@adamjanicki/ui": path.resolve(__dirname, "../lib/src"),
    },
  },
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
    fs: {
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "../lib/src"),
      ],
    },
    watch: {
      ignored: ["!**/node_modules/@adamjanicki/ui/**", "!../lib/src/**"],
    },
  },
});
