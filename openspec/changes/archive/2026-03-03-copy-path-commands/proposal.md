## Why

Claude Code uses `@path` syntax to reference files. When working in VSCode alongside Claude Code, users need to quickly copy file paths in this format. Currently there is no way to do this without manually typing the `@` prefix and the path.

## What Changes

- Add a "Copy Relative Path for Claude Code" command that copies the active file's workspace-relative path prefixed with `@` to the clipboard (e.g., `@src/index.ts`)
- Add a "Copy Absolute Path for Claude Code" command that copies the active file's absolute path prefixed with `@` to the clipboard (e.g., `@/Users/john/project/src/index.ts`)

## Capabilities

### New Capabilities

- `copy-path`: Commands to copy file paths in Claude Code `@path` format to the clipboard

### Modified Capabilities

(none)

## Impact

- New commands registered in `package.json` under `contributes.commands`
- New extension activation event for the commands
- No external dependencies required (uses VSCode clipboard API)
