## Why

The extension currently only copies paths from the active text editor. Users often need to reference files or directories they see in the file explorer without opening them first.

## What Changes

- Extend existing `copyRelativePath` and `copyAbsolutePath` commands to accept `Uri` arguments from the file explorer
- When invoked from the explorer context menu, copy the path without line numbers
- Support multiple file or directory selection in the explorer (bullet list format)
- Append trailing slash to directory paths
- Add explorer context menu entries in `package.json`
- Fall back to active editor behavior when no `Uri` argument is provided

## Capabilities

### New Capabilities

- `explorer-copy-path`: Copying file and directory paths from the file explorer context menu

### Modified Capabilities

- `copy-path`: Commands now accept optional `Uri` arguments and fall back to active editor when not provided

## Impact

- `src/extension.ts`: Command handler signatures change to accept `(uri?, allUris?)` arguments
- `package.json`: Add `menus.explorer/context` entries for both commands
