## Context

The extension copies active editor file paths in Claude Code's `@path` format. Commands are registered as no-arg callbacks. VSCode's explorer context menu passes `(uri, allUris)` to commands, which the current implementation ignores.

## Goals / Non-Goals

**Goals:**

- Extend existing commands to accept `Uri` arguments from the explorer context menu
- Support single and multiple file or directory selection
- Append trailing slash to directory paths
- Fall back to active editor when no `Uri` is provided

**Non-Goals:**

- Adding new commands (reuse existing two)
- Keyboard shortcuts for explorer commands
- Copying line numbers from explorer (no editor context)

## Decisions

### Extend command signatures to accept `(uri?, allUris?)`

VSCode passes `(clickedUri, selectedUris)` to explorer context menu commands. Change command handlers from `() => copyPath(...)` to `(uri?, allUris?) => ...`.

When `uri` is provided, skip the active editor path and use the URI directly. This keeps a single code path per command.

Alternative: Create separate commands for explorer. Rejected because it duplicates logic and clutters the command palette.

### Detect directories via `vscode.workspace.fs.stat`

Use `vscode.workspace.fs.stat(uri)` to check `FileType.Directory`. This is async but reliable across all file systems (local, remote, virtual).

Alternative: Check if `fsPath` ends with a separator. Rejected because it is unreliable — URIs do not guarantee trailing separators for directories.

### Reuse existing multi-item format

Multiple explorer selections use the same bullet list format as multi-cursor: `- @path\n`. This keeps clipboard output consistent.

## Risks / Trade-offs

- `fs.stat` call adds minor latency for directory detection, but it is only called for explorer invocations and is negligible for local file systems
