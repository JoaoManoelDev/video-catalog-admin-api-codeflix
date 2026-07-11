import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    environment: "node",
    root: "./",
    setupFiles: ["./test/setup-e2e.ts"],
    fileParallelism: false,
    maxWorkers: 1,
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
  oxc: false,
});
