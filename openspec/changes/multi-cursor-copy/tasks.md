## 1. Core Implementation

- [ ] 1.1 Add `formatLineNumber(selection)` function that always returns `#N` or `#N-M` (never empty)
- [ ] 1.2 Update `copyPath` to branch on `editor.selections.length`: single-cursor uses existing logic, multi-cursor maps each selection to `- @path` + `formatLineNumber` joined by newline
- [ ] 1.3 Update status bar message for multi-cursor: show "Copied N lines" instead of full text

## 2. Tests

Add test cases to `src/test/extension.test.ts`:

- [ ] 2.1 Add test: multi-cursor with no selection copies bullet list with line numbers (set multiple cursors via `editor.selections`, no selection)
- [ ] 2.2 Add test: multi-cursor with range selections copies bullet list with line ranges
- [ ] 2.3 Add test: multi-cursor with mixed selections (some empty, some range) copies correct bullet list
- [ ] 2.4 Add test: single-cursor backward compatibility — verify existing tests still pass with no bullet prefix
