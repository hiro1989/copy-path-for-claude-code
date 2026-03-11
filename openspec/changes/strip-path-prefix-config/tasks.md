## 1. Configuration

- [x] 1.1 Add `copy-path-for-claude-code.stripPrefix` setting to `contributes.configuration` in `package.json` with type `string`, default `""`, and `resource` scope

## 2. Core Implementation

- [x] 2.1 Modify the `copyRelativePath` command's `getPath` callback in `src/extension.ts` to read the `stripPrefix` config and strip the matching prefix from the relative path

## 3. Tests

- [x] 3.1 Add tests for prefix stripping: prefix matches, prefix does not match, prefix is empty, prefix equals entire path
- [x] 3.2 Verify absolute path copy is unaffected by the `stripPrefix` setting
- [x] 3.3 Add tests for prefix stripping combined with line-number formatting: single-line selection, multi-line selection, and multiple cursors

## 4. Documentation

- [x] 4.1 Update the related section in README.md
