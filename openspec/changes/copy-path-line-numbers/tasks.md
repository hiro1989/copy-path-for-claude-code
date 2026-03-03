## 1. Core Implementation

- [x] 1.1 Add `formatLineSuffix(selection)` helper function in `src/extension.ts` that returns `""`, `"#<line>"`, or `"#<start>-<end>"` with the column-0 edge case handling
- [x] 1.2 Integrate `formatLineSuffix` into `copyRelativePath` command handler
- [x] 1.3 Integrate `formatLineSuffix` into `copyAbsolutePath` command handler

## 2. Tests

- [x] 2.1 Add tests for `copyRelativePath` with single-line and multi-line selections
- [x] 2.2 Add tests for `copyAbsolutePath` with single-line and multi-line selections
- [x] 2.3 Add test for column-0 edge case (selection ending at start of next line)
- [x] 2.4 Verify existing no-selection tests still pass

## 3. Validation

- [x] 3.1 Run `pnpm lint` and fix any issues
- [x] 3.2 Run `pnpm test` and verify all tests pass
