## Context

The extension has two commands (`copyRelativePath`, `copyAbsolutePath`) that copy `@`-prefixed file paths to the clipboard. Both share the same pattern: get the active editor, format the path, copy to clipboard. Neither currently inspects `editor.selection`.

## Goals / Non-Goals

**Goals:**

- Append line number suffix to copied paths when user has an active text selection
- Keep existing no-selection behavior unchanged

**Non-Goals:**

- Multi-cursor or multi-selection support (future work)
- Keyboard shortcut bindings (user can configure manually)

## Decisions

### Extract a shared line suffix formatter

Both commands need the same selection-to-suffix logic. Extract a helper function `formatLineSuffix(selection: vscode.Selection): string` that returns:

- `""` when `selection.isEmpty`
- `"#<line>"` when single-line selection
- `"#<startLine>-<endLine>"` when multi-line selection

**Rationale**: Avoids duplicating the logic in both command handlers. Small enough to keep in `extension.ts`.

### Use first selection only

`editor.selection` (singular) returns the primary selection. Ignore `editor.selections` (plural) for now.

**Rationale**: Keeps scope small. Multi-cursor can be added later without breaking the single-selection path.

## Risks / Trade-offs

- **Edge case: selection ends at column 0 of next line** — When a user selects full lines, VS Code often places the cursor at column 0 of the line after the selection. This could produce `#10-13` when the user visually selected lines 10-12. Mitigation: if `end.character === 0` and `end.line > start.line`, use `end.line - 1` as the effective end line.
