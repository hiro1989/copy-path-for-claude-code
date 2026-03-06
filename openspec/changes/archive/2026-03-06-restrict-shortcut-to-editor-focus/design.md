## Context

VSCode passes `uri` and `allUris` arguments to commands invoked via context menus, but passes no arguments when a command is invoked via a keyboard shortcut. The extension currently falls back to `vscode.window.activeTextEditor` when `uri` is undefined. This means a shortcut pressed while Explorer is focused silently copies the last active editor's path — not the Explorer selection. No public VSCode Extension API exists to retrieve Explorer selection state from a keyboard shortcut context.

## Goals / Non-Goals

**Goals:**

- Prevent the shortcut from silently copying an unrelated editor path when Explorer is focused.
- Keep context menu behavior unchanged.

**Non-Goals:**

- Making shortcuts work in Explorer focus (impossible with public API).
- Changing the fallback behavior when editor is focused.
- Modifying `src/extension.ts`.

## Decisions

**Decision: Add `"when": "editorFocus"` to keybinding contributions.**

- The `editorFocus` context key is true when a text editor has focus, false when Explorer or other panels are focused.
- With this clause, VSCode simply does not invoke the command on shortcut press outside editor focus — no silent fallback occurs.
- Alternative considered: show an error message when `uri` is undefined and no active editor. Rejected because it requires detecting Explorer focus from extension code, which has no reliable public API, and adds runtime complexity for a case better handled declaratively.
- Alternative considered: separate editor-only commands distinct from Explorer commands. Rejected as unnecessary complexity — the same command already handles both invocation paths correctly; only the keybinding scope needs tightening.

## Risks / Trade-offs

- [UX gap] Users who assigned a shortcut and expected it to work in Explorer will find it silently inactive. → Mitigation: document this in README; the silent-do-nothing behavior is less harmful than silently copying the wrong path.
- [No code change] The fix is purely declarative (`package.json`), so no unit tests change. Integration/manual testing is the only verification path.
