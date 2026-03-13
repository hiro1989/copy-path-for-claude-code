## Context

The extension copies file paths in `@path` format. Multi-item output (multi-file from explorer, multi-cursor from editor) currently preserves VSCode's selection order. There are two code paths that produce multi-item output:

- **Explorer**: `copyPath` in `extension.ts` lines 16-19 — maps URIs to formatted paths, joins as bullet list
- **Editor**: `copyPath` in `extension.ts` lines 33-34 — maps selections to `@path#line` strings, joins as bullet list

Both produce a `string[]` before joining. Sorting can be inserted at this array stage.

## Goals / Non-Goals

**Goals:**

- Add a boolean config `copy-path-for-claude-code.sortPaths` (default `false`)
- When enabled, sort multi-item output alphabetically
- For multi-cursor (same file, different lines), sort numerically by start line then by end line
- Keep sorting logic in a pure function for testability

**Non-Goals:**

- Custom sort orders (e.g., by file type, directory-first)
- Sorting single-item output (no-op, only one item)

## Decisions

### 1. Sort function location: `format.ts`

Add a `sortPaths` function to `format.ts` rather than creating a new file. The function operates on formatted path strings and is cohesive with the existing formatting utilities.

**Alternative considered:** New `sort.ts` file — rejected because the project is small and a separate file adds unnecessary indirection for a single function.

### 2. Sort formatted strings, not raw data

Sort the already-formatted `@path#line` strings rather than sorting URIs or selections before formatting. This simplifies the interface to `(paths: string[]) => string[]`.

For line numbers, use a natural sort that extracts numeric segments so `#13` sorts before `#126`. The sort key is: (1) file path alphabetically, (2) start line numerically, (3) end line numerically.

**Alternative considered:** Sort selections or URIs before formatting — rejected because it would require passing sort awareness into both the explorer and editor code paths separately, increasing coupling.

### 3. Config key: `sortPaths`

Use `copy-path-for-claude-code.sortPaths` as the configuration key. Read it at copy time via `vscode.workspace.getConfiguration`.

### 4. Integration point: after array creation, before join

In `copyPath`, sort the `paths` or mapped selections array immediately before joining with `\n`. This is a single insertion point for both explorer and editor paths.

## Risks / Trade-offs

- **Sort stability**: JavaScript's `Array.prototype.sort` is stable in all modern engines — identical paths with different line ranges will preserve relative order for equal sort keys.
- **Performance**: Sorting is O(n log n) on a small array (number of selections or files). Negligible.
