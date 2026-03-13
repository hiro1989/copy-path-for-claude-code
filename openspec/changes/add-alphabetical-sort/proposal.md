## Why

When copying multiple files or lines, users may want the output sorted alphabetically for readability and consistency. Currently, items are copied in the order VSCode provides, which may not be intuitive. A configurable sort option gives users control over output ordering.

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
- `src/format.ts`: Possible sort utility function
- No breaking changes — disabled by default
