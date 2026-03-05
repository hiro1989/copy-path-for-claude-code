<p align="center">
  <img src="https://raw.githubusercontent.com/hiro1989/copy-path-for-claude-code/main/assets/icon.png" alt="Copy Path for Claude Code" width="200">
</p>

<h1 align="center">Copy Path for Claude Code</h1>

<p align="center">
  VS Code extension that copies the active file path in Claude Code's <code>@path</code> format to the clipboard.
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=arx8.copy-path-for-claude-code">Install from VS Code Marketplace</a>
</p>

## Demo

<p align="center">
  <img src="https://raw.githubusercontent.com/hiro1989/copy-path-for-claude-code/main/images/demo.gif" alt="Demo" width="600">
</p>

## Why?

[Claude Code for VS Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) has a built-in command `Claude Code: Insert @-Mention Reference` — which would make this extension completely unnecessary. Unfortunately, it still doesn't work in some environments

The issues below are closed, but the command still doesn't work in my environment for months. e.g.

- [BUG: VSCode Extension: "Insert @-Mention Reference" and "Insert At-Mentioned" keyboard shortcuts not working on Windows (v2.1.7) · Issue #18083 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/18083)
- [BUG: Insert At-Mentioned doesn't work anymore in VSCode Version: 1.108.0 · Issue #18126 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/18126)

So here we are. 🫠

If you're in the same boat, this extension has your back until the official command is fixed. 🫰

## Features

- **Copy Relative Path** — Copies `@relative/path/to/file.ts ` to clipboard
- **Copy Absolute Path** — Copies `@/absolute/path/to/file.ts ` to clipboard
- **Line number support** — When text is selected, appends line numbers automatically
  - Single line: `@path#5 `
  - Range: `@path#5-10 `
- **Multi-cursor support** — With multiple cursors, copies all positions as a markdown list
  ```
  - @path#3
  - @path#10
  - @path#25
  ```

A trailing space (or newline for multi-line) is included, so you can start typing right after pasting. 📑

## Usage

1. Open a file in the editor
2. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
3. Run one of:
   - `Copy Relative Path for Claude Code`
   - `Copy Absolute Path for Claude Code`
4. Paste the result into Claude Code

Optionally, select text before copying to include line numbers.

## Keyboard Shortcuts

This extension does not register default keybindings. To set your own:

1. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. Run `Preferences: Open Keyboard Shortcuts`
3. Search for `Copy Path for Claude Code`
4. Click the pencil icon next to the command and assign your preferred shortcut

| Command                            | Command ID                                   |
| ---------------------------------- | -------------------------------------------- |
| Copy Relative Path for Claude Code | `copy-path-for-claude-code.copyRelativePath` |
| Copy Absolute Path for Claude Code | `copy-path-for-claude-code.copyAbsolutePath` |

You can also edit `keybindings.json` directly. For example:

```json
[
  {
    "key": "ctrl+shift+c",
    "command": "copy-path-for-claude-code.copyRelativePath",
    "when": "editorTextFocus"
  }
]
```

## Requirements

- VS Code 1.109.0 or later

## License

MIT
