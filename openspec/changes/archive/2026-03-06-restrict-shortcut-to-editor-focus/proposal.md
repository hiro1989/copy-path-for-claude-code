## Why

When a shortcut key is assigned to Copy Relative/Absolute Path and invoked while the Explorer is focused, the command silently falls back to copying the active editor's path instead of the Explorer selection. This is a silent misbehavior: the user expects the Explorer-selected path but gets an unrelated editor path. The root cause is a VSCode API limitation — keyboard shortcuts pass no `uri` argument, and no public API exists to read Explorer selection from an extension.

## What Changes

- Add `"when": "editorFocus"` to both `copyRelativePath` and `copyAbsolutePath` keybinding contributions in `package.json`.
- Shortcut keys will now only fire when an editor is focused; pressing the shortcut while Explorer is focused does nothing (VSCode default behavior for unmatched keybindings).
- Context menu entries in the Explorer are unaffected and continue to work as before.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `copy-path`: The keybinding activation context changes. Shortcuts are now restricted to editor focus only. Explorer path copy remains available exclusively via context menu.

## Impact

- `package.json` — `contributes.keybindings` entries for both commands gain a `when` field.
- No changes to extension source code (`src/extension.ts`).
- No changes to Explorer context menu behavior.
- User-facing: shortcut no longer silently copies wrong path; Explorer users must use context menu.
