import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetDir = process.env.HOT80_TARGET || "answer";

export default defineConfig({
  resolve: {
    alias: {
      "@target": resolve(__dirname, targetDir)
    }
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.{js,jsx}"],
    restoreMocks: true,
    clearMocks: true
  }
});
