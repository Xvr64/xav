import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        portfolio: "index.html",
        liquidGlass: "liquid-glass.html",
      },
    },
  },
});
