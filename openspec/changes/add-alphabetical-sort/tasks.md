## 1. Sort function stubs and tests

- [x] 1.1 Add `sortPaths` stub to `format.ts` with JSDoc, signature `(paths: string[]) => string[]`, and no-op body (returns input unchanged)
- [x] 1.2 Write tests for `sortPaths`: alphabetical sort, numeric-not-lexicographic sort (9 < 13 < 126), start-then-end line sort, single-item no-op, empty array
- [x] 1.3 Implement `sortPaths` logic: split on last `#`, sort by path alphabetically then by start line and end line numerically

## 2. Configuration and integration

- [x] 2.1 Add stub for config-gated sort wiring in `extension.ts`: extract editor `.map()` result into a variable, add conditional sort call site (no-op, always disabled) for both explorer and editor paths
- [ ] 2.2 Write tests for config-gated sort integration in `copyPath` (sort applied when enabled, original order preserved when disabled, single-item no-op with sort enabled)
- [ ] 2.3 Add `copy-path-for-claude-code.sortPaths` boolean property (default `false`) to `package.json` contributes.configuration
- [ ] 2.4 Implement config reading in `extension.ts`: read `sortPaths` setting and conditionally call `sortPaths` before join

## 3. Documentation

- [ ] 3.1 Update the related section in README.md
