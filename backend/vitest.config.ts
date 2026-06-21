import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname),
  css: false,
  test: {
    environment: "node",
    globals: true,
    testTimeout: 15_000,
    hookTimeout: 15_000,
    setupFiles: ["./tests/setup.ts"],
    fileParallelism: false, // tests share one real Postgres DB; avoid cross-test races
  },
});
