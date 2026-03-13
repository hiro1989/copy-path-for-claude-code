## Context

The extension copies file paths in `@path` format. Multi-item output (multi-file from explorer, multi-cursor from editor) currently preserves VSCode's selection order. There are two code paths that produce multi-item output:

- **Explorer**: `copyPath` in `extension.ts` — maps URIs to a `paths` array (`string[]`), then joins as bullet list
- **Editor**: `copyPath` in `extension.ts` — maps selections to `@path#line` strings inline in a template literal (no intermediate array)

The explorer path already has an intermediate `string[]`. The editor path requires extracting the `.map()` result into a variable before sorting can be applied.

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

The sort function receives strings in the format `@path`, `@path#line`, or `@path#start-end`. Parsing strategy: split on the last `#` to separate the path from the optional line suffix. If no `#` is present, the entire string is the path with no line number. If `#` is present, the segment after `#` is parsed as `start` or `start-end` (both numeric). Sort key: (1) path part alphabetically, (2) start line numerically, (3) end line numerically. Note: the `- ` bullet prefix is added during join, not present in the array elements passed to the sort function.

**Alternative considered:** Sort selections or URIs before formatting — rejected because it would require passing sort awareness into both the explorer and editor code paths separately, increasing coupling.

### 3. Config key: `sortPaths`

Use `copy-path-for-claude-code.sortPaths` as the configuration key. Read it at copy time via `vscode.workspace.getConfiguration`.

### 4. Integration point: after array creation, before join

In `copyPath`, sort the array of formatted strings immediately before joining with `\n`. For the explorer path, sort the existing `paths` array. For the editor path, extract the `.map()` result into an intermediate variable first, then sort it. Both paths converge on the same pattern: build array → sort → join.

## Risks / Trade-offs

- **Sort stability**: JavaScript's `Array.prototype.sort` is stable in all modern engines — identical paths with different line ranges will preserve relative order for equal sort keys.
- **Performance**: Sorting is O(n log n) on a small array (number of selections or files). Negligible.
- **package.json config**: The `configuration` contribution uses standard VSCode API — no minimum engine version bump needed beyond the existing requirement.
