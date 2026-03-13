## Why

When copying multiple files or lines, the output order depends on VSCode's internal selection order, which is non-deterministic from the user's perspective. This makes multi-item output non-reproducible and harder to review or share consistently. Without this change, users must manually reorder copied paths every time they want a consistent, scannable list.

## What Changes

- Add a new boolean configuration option to enable alphabetical sorting of multi-item copy output
- When enabled, sort multi-file paths alphabetically
- When enabled, sort multi-line paths alphabetically by file path, then numerically by line number (to avoid lexicographic ordering issues like `13 > 126`)
- Default: `false` (preserves current behavior)

## Capabilities

### New Capabilities

- `alphabetical-sort`: Configuration option and sorting logic for multi-item copy output (multi-file from explorer and multi-cursor lines from editor)

### Modified Capabilities

(none — sorting is applied as a post-processing step before clipboard write, existing requirements remain unchanged)

## Impact

- `package.json`: New `configuration` entry for the sort setting
- `src/extension.ts`: Read config and apply sorting before clipboard write
- `src/format.ts` or `src/sort.ts`: Sort utility function (location to be decided in design)
- `src/test/`: New or updated test files for sort behavior
- No breaking changes — disabled by default
