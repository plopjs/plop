/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config)

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./tests/config/setup.js"],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
