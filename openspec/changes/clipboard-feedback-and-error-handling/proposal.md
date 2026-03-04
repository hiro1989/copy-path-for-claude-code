## Why

Clipboard commands complete silently—users get no confirmation of success and no message on failure. This makes the extension feel unresponsive.

## What Changes

- Show a brief status bar message when a path is successfully copied
- Wrap clipboard writes in error handling to notify users on failure

## Capabilities

### Modified Capabilities

- `copy-relative-path`: Add success feedback and error handling
- `copy-absolute-path`: Add success feedback and error handling

## Impact

- `src/extension.ts`: Both command handlers gain try-catch and status bar notification
