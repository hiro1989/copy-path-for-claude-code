import { defineConfig } from "@vscode/test-cli"

// oxlint-disable-next-line import/no-default-export -- allowed for configuration
export default defineConfig({
  files: "out/test/**/*.test.js",
})
