## Context

The extension currently reads only `editor.selection` (singular) to format the line suffix. VSCode exposes `editor.selections` (plural) which contains all cursor positions when using multi-cursor. The `copyPath` function needs to handle this array.

## Goals / Non-Goals

**Goals:**

- Support multi-cursor: copy all cursor positions as markdown bullet list
- Preserve single-cursor behavior exactly as-is

**Non-Goals:**

- Multi-file support (all cursors are in the same editor)
- Custom formatting options or configuration

## Decisions

### Decision: Always include line numbers in multi-cursor mode

In single-cursor mode, an empty selection produces no line suffix. In multi-cursor mode, each cursor position SHALL always produce a line number, because the user is intentionally targeting specific lines.

**Alternative considered**: Reuse the same isEmpty logic. Rejected because cursor-only positions in multi-cursor mode are meaningless without line numbers.

### Decision: Separate formatting function for multi-cursor line reference

Create a new function `formatLineNumber(selection)` that always returns `#N` or `#N-M`, distinct from `formatLineSuffix` which returns empty string for isEmpty. This avoids adding a flag parameter to the existing function.

**Alternative considered**: Add a boolean parameter to `formatLineSuffix`. Rejected because it complicates the existing function for a concern that belongs to a different code path.

### Decision: Branch in copyPath based on selections.length

`copyPath` checks `editor.selections.length`:

- 1: existing behavior (`@path` + `formatLineSuffix`)
- 2 or more: map each selection to `- @path` + `formatLineNumber`, join with newline

**Alternative considered**: Always use the multi-cursor path and special-case length 1. Rejected for readability and backward compatibility.

## Risks / Trade-offs

- [Clipboard content is multiline for multi-cursor] → Expected behavior; markdown bullets are multiline by nature
- [Status bar message could be long with many cursors] → Show count instead of full text (e.g., "Copied 5 lines")
