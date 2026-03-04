## Context

Both command handlers in `extension.ts` call `clipboard.writeText()` without try-catch and without user feedback. The two handlers share nearly identical logic.

## Goals and Non-Goals

**Goals:**

- Provide visual feedback on successful copy
- Handle clipboard errors gracefully

**Non-Goals:**

- Refactoring handler duplication (out of scope for this change)
- Configurable notification style

## Decisions

### Decision 1: Use `vscode.window.setStatusBarMessage` for success

- Lightweight, auto-dismissing (3 seconds)
- Less intrusive than `showInformationMessage` which creates a persistent notification
- Message format: `Copied: @<path><suffix>`

### Decision 2: Use `vscode.window.showErrorMessage` for failure

- Appropriate severity level for an unexpected error
- Persists until dismissed so the user can read it
