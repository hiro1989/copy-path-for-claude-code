## 1. Sort function stubs and tests

- [ ] 1.1 Add `sortPaths` stub to `format.ts` with JSDoc, signature `(paths: string[]) => string[]`, and no-op body (returns input unchanged)
- [ ] 1.2 Write tests for `sortPaths`: alphabetical sort, numeric line sort, start-then-end line sort, single-item no-op, empty array
- [ ] 1.3 Implement `sortPaths` logic: split on last `#`, sort by path alphabetically then by start line and end line numerically

## 2. Configuration

- [ ] 2.1 Add `copy-path-for-claude-code.sortPaths` boolean property (default `false`) to `package.json` contributes.configuration
- [ ] 2.2 Write tests for config-gated sort integration in `copyPath` (sort applied when enabled, skipped when disabled)
- [ ] 2.3 Integrate `sortPaths` into `copyPath` in `extension.ts`: read config, conditionally sort array before join for both explorer and editor paths

## 3. Documentation

- [ ] 3.1 Update the related section in README.md
