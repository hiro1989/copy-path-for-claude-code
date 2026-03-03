## Why

When sharing file references with Claude Code, users often need to point to specific lines, not just files. Currently the copy-path commands only produce `@src/index.ts`, forcing users to manually append line numbers. Adding automatic line number suffixes when text is selected removes this friction.

## What Changes

- Both `copyRelativePath` and `copyAbsolutePath` commands append line number information when the user has an active text selection:
  - No selection (`selection.isEmpty`): path only (unchanged behavior)
  - Single-line selection (start.line === end.line): `#<line>`
  - Multi-line selection: `#<startLine>-<endLine>`
- Line numbers are 1-based (matching VS Code's display)
- Multi-cursor selections are out of scope for this change

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `copy-path`: Add line number suffix to copied paths when text is selected

## Impact

- `src/extension.ts`: Both command handlers need selection-aware formatting
- `src/test/extension.test.ts`: New test cases for line number scenarios
- No new dependencies or API changes
