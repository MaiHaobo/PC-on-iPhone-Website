import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  // Relative base so the build works on GitHub Pages project sites
  // (https://<user>.github.io/PC-on-iPhone-Website/) and on any subpath.
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        features: resolve(__dirname, "features.html"),
        download: resolve(__dirname, "download.html"),
        install: resolve(__dirname, "install.html"),
        guide: resolve(__dirname, "guide.html"),
        faq: resolve(__dirname, "faq.html"),
        fandback: resolve(__dirname, "fandback.html"),
        about: resolve(__dirname, "about.html"),
      },
    },
  },
});