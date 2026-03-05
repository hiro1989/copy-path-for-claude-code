## 1. Command Handler Extension

- [x] 1.1 Refactor command handlers to accept `(uri?: vscode.Uri, allUris?: vscode.Uri[])` arguments and branch between explorer and editor paths
- [x] 1.2 Implement directory detection using `vscode.workspace.fs.stat` and append trailing slash for directories
- [x] 1.3 Implement multi-selection support using `allUris` with bullet list format

## 2. Menu Registration

- [ ] 2.1 Add `menus.explorer/context` entries for both commands in `package.json`

## 3. Tests

- [ ] 3.1 Add tests for explorer single file copy (relative and absolute)
- [ ] 3.2 Add tests for explorer directory copy with trailing slash
- [ ] 3.3 Add tests for explorer multi-selection copy
- [ ] 3.4 Add tests for fallback to active editor when no Uri provided

## 4. Documentation

- [ ] 4.1 Update the related section in README.md
