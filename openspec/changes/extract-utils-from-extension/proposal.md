## Why

`src/extension.ts` contains all logic in a single file — formatting helpers, clipboard orchestration, and VS Code activation are mixed together. The non-exported utility functions (`formatLineNumber`, `formatLineSuffix`, `formatExplorerPath`) cannot be unit-tested in isolation because they are not exported. Extracting them into a dedicated module improves testability and separation of concerns.

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
- `src/test/`: new test file for format utilities
- No API, dependency, or user-facing behavior changes
