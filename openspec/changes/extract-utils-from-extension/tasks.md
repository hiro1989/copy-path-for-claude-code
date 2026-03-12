## 1. Create format module stubs

- [ ] 1.1 Create `src/format.ts` with exported stub functions (`formatLineNumber`, `formatLineSuffix`, `formatExplorerPath`) — function name, JSDoc, input and output types, no logic

## 2. Write unit tests

Note: `formatExplorerPath` is intentionally excluded from unit tests because it calls `vscode.workspace.fs.stat`. Coverage is provided by the existing Explorer Path Copy integration tests in `extension.test.ts`.

- [ ] 2.1 Create `src/test/format.test.ts` with tests for `formatLineNumber` (single line, multi-line, column-0 edge case)
- [ ] 2.2 Add tests for `formatLineSuffix` (empty selection, single line, multi-line, column-0 edge case)

## 3. Implement format functions

- [ ] 3.1 Move `formatLineNumber` logic from `src/extension.ts` to `src/format.ts`
- [ ] 3.2 Move `formatLineSuffix` logic from `src/extension.ts` to `src/format.ts`
- [ ] 3.3 Move `formatExplorerPath` logic from `src/extension.ts` to `src/format.ts`

## 4. Update extension module

- [ ] 4.1 Update `src/extension.ts` to import formatting functions from `src/format.ts`, remove local definitions, and run existing integration tests to verify no regressions## 5. Documentation

## 5. Documentation

- Nothing. Just refactoring internal implementation without changing public API or behavior.
