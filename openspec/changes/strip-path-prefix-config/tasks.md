## 1. Configuration

- [ ] 1.1 Add `copy-path-for-claude-code.stripPrefix` setting to `contributes.configuration` in `package.json` with type `string`, default `""`, and `resource` scope

## 2. Core Implementation

- [ ] 2.1 Modify the `copyRelativePath` command's `getPath` callback in `src/extension.ts` to read the `stripPrefix` config and strip the matching prefix from the relative path

## 3. Tests

- [ ] 3.1 Add tests for prefix stripping: prefix matches, prefix does not match, prefix is empty, prefix equals entire path
- [ ] 3.2 Verify absolute path copy is unaffected by the `stripPrefix` setting

## 4. Documentation

- [ ] 4.1 Update the related section in README.md
