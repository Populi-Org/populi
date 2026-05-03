import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: ["node_modules", "tests", "app/generated", "prisma"],
    },
  },
  resolve: {
    alias: [{ find: /^@\//, replacement: `${path.resolve(__dirname, "./")}/` }],
  },
});
