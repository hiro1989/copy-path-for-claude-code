## Context

`src/extension.ts` (113 lines) contains three non-exported formatting functions alongside the VS Code activation logic:

- `formatLineNumber(selection)` — converts a Selection to `#line` or `#start-end`
- `formatLineSuffix(selection)` — same as above but returns empty string for empty selections
- `formatExplorerPath(uri, getPath)` — formats a URI as `@path` with trailing slash for directories

These functions are pure logic (except `formatExplorerPath` which calls `vscode.workspace.fs.stat`), but cannot be imported by test files because they are not exported.

Existing tests in `src/test/extension.test.ts` cover these indirectly through VS Code command integration tests.

## Goals / Non-Goals

**Goals:**

- Extract formatting functions to `src/format.ts` so they can be unit-tested directly
- Add focused unit tests in `src/test/format.test.ts`
- Keep `extension.ts` as a thin activation layer

**Non-Goals:**

- Refactoring `copyPath` or the command registration logic
- Changing any user-facing behavior
- Modifying existing integration tests

## Decisions

### 1. New module name: `src/format.ts`

All three functions share a single concern: formatting paths and line numbers for clipboard output. A single `format.ts` file is sufficient given the small number of functions (3).

**Alternative considered:** `src/utils.ts` — rejected because "utils" is vague and invites unrelated code to accumulate.

### 2. Which functions to extract

Extract: `formatLineNumber`, `formatLineSuffix`, `formatExplorerPath`

Keep in `extension.ts`: `copyPath` (orchestration logic tightly coupled to VS Code clipboard and status bar), `activate`, `deactivate`.

**Rationale:** The three format functions are leaf-level helpers with clear inputs and outputs. `copyPath` interleaves formatting with VS Code side effects (clipboard, status bar), so extracting it would require mocking those effects in unit tests — defeating the purpose.

### 3. Test approach

Unit tests in `src/test/format.test.ts` will test `formatLineNumber` and `formatLineSuffix` with mock `vscode.Selection` objects.

**Scope note:** The proposal states "unit tests for each extracted function," but this design consciously excludes `formatExplorerPath` from `format.test.ts`. The function calls `vscode.workspace.fs.stat` internally, making isolated unit testing impractical without a larger refactor. Existing integration tests in `extension.test.ts` already cover its behavior through the Explorer Path Copy suite.

**Alternative considered:** Refactoring `formatExplorerPath` to accept a `vscode.FileType` parameter instead of calling `fs.stat` internally. This would invert the async encapsulation — callers (`copyPath`) would need to await the stat result before calling `formatExplorerPath` and supply a test double for a single function. The cost is disproportionate to the benefit for this scope.

## Risks / Trade-offs

- [Risk] Import cycle between `format.ts` and `extension.ts` → Mitigation: `format.ts` has no imports from `extension.ts`; dependency is one-directional.
- [Risk] Existing integration tests break due to module restructuring → Mitigation: No behavior change; functions are moved, not modified. Integration tests call VS Code commands, not functions directly.
