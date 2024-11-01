import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "node:path";

const resolve = (dir) => path.resolve(__dirname, dir);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve("src"),
      },
    ],
  },
});
