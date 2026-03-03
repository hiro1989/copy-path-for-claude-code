# Copy Path for Claude Code

VS Code extension that copies the active file path in Claude Code's `@path` format to the clipboard.

## Features

- **Copy Relative Path** — Copies `@relative/path/to/file.ts` to clipboard
- **Copy Absolute Path** — Copies `@/absolute/path/to/file.ts` to clipboard
- **Line number support** — When text is selected, appends line numbers automatically
  - Single line: `@path#5`
  - Range: `@path#5-10`

## Usage

1. Open a file in the editor
2. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
3. Run one of:
   - `Copy Relative Path for Claude Code`
   - `Copy Absolute Path for Claude Code`
4. Paste the result into Claude Code

Optionally, select text before copying to include line numbers.

## Requirements

- VS Code 1.109.0 or later

## License

MIT
