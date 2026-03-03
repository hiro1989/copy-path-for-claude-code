## Context

The extension currently has a scaffold with a single "Hello World" command. It needs two new commands that copy file paths in Claude Code `@path` format to the clipboard. The existing `extension.ts` registers commands via `vscode.commands.registerCommand` and the commands are declared in `package.json` under `contributes.commands`.

## Goals / Non-Goals

**Goals:**

- Provide two commands: copy relative path and copy absolute path, both prefixed with `@`
- Use the active editor's document to determine the file path
- Copy the result to the system clipboard via `vscode.env.clipboard`

**Non-Goals:**

- Line range support (e.g., `@file.ts:10-20`) is out of scope for this change
- Multi-file selection or explorer context menu integration
- Removing the existing "Hello World" command (can be cleaned up separately)

## Decisions

### Command IDs and titles

- `claude-code-line-copy.copyRelativePath` with title "Copy Relative Path for Claude Code"
- `claude-code-line-copy.copyAbsolutePath` with title "Copy Absolute Path for Claude Code"

Rationale: follows the existing `claude-code-line-copy.*` namespace convention from `package.json`.

### Path resolution

- Relative path: use `vscode.workspace.asRelativePath(uri)` which returns the path relative to the workspace root
- Absolute path: use `document.uri.fsPath` which gives the OS file system path

Rationale: these are the standard VSCode APIs for this purpose. No custom path manipulation needed.

### No active editor handling

- If no editor is active when the command runs, show an info message and do nothing

Rationale: simple, non-disruptive feedback. No need for error-level messaging.

### Code structure

- Keep all command logic in `extension.ts` since the handlers are small (a few lines each)
- Register both commands in the `activate` function

Rationale: no benefit to extracting separate modules for trivial handlers.

## Risks / Trade-offs

- Multi-root workspaces: `asRelativePath` uses the closest workspace folder, which is the expected behavior. No special handling needed.
- Untitled (unsaved) files: `fsPath` still works but the path may not be meaningful. Acceptable edge case for now.
