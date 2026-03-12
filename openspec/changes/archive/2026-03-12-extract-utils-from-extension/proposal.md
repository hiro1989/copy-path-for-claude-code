## Why

This project mandates TDD (CLAUDE.md), but the current structure of `src/extension.ts` makes it impossible to unit-test formatting logic in isolation. `formatLineNumber`, `formatLineSuffix`, and `formatExplorerPath` are non-exported functions buried in the activation module, so they can only be tested indirectly through VS Code command integration tests.

Without this change, bugs in formatting functions cannot be caught by focused unit tests, and future formatting changes cannot follow the mandatory TDD cycle (write test first, then implement).

## What Changes

- Extract `formatLineNumber`, `formatLineSuffix`, and `formatExplorerPath` from `src/extension.ts` into a new `src/format.ts` module
- Export the extracted functions so they can be imported by both `extension.ts` and test files
- Add unit tests for each extracted function in a new test file
- Keep `copyPath`, `activate`, and `deactivate` in `src/extension.ts`

## Capabilities

### New Capabilities

(none — this is an internal refactor with no new user-facing capabilities)

### Modified Capabilities

(none — no spec-level behavior changes, only internal code reorganization)

## Impact

- `src/extension.ts`: reduced to orchestration and activation logic
- `src/format.ts`: new file with formatting utilities
- `src/test/format.test.ts`: new unit tests for formatting functions
- `dist/`: bundle output unchanged (esbuild tree-shakes the same code regardless of module boundaries)
- No API, dependency, or user-facing behavior changes
