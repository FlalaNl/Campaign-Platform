import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const fromRoot = (relativePath: string): string =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@campaign-platform/domain": fromRoot("./packages/domain/src/index.ts"),
      "@campaign-platform/application": fromRoot("./packages/application/src/index.ts"),
      "@campaign-platform/db": fromRoot("./packages/db/src/index.ts"),
    },
  },
});
