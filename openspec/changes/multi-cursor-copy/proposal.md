## Why

When using multiple cursors in VSCode, the extension only copies based on the primary selection. Users working with multiple cursors are intentionally targeting specific lines, so the extension should copy all cursor positions as a markdown bullet list.

## What Changes

- Support `editor.selections` (plural) to capture all cursor positions
- When multiple cursors exist, format output as markdown bullet list (`- @path#N` per cursor)
- When a single cursor exists, preserve current behavior (no bullet prefix)
- In multi-cursor mode, always include line numbers even for empty selections (cursor-only)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `copy-path`: Add multi-cursor support with bullet list output format

## Impact

- `src/extension.ts`: Modify `copyPath` to handle `editor.selections`, add formatting logic for multi-cursor output
- Tests: Add scenarios for multi-cursor behavior
