## Why

When pasting a copied `@path` reference into an input field, users must manually add a trailing space (single line) or newline (multi-line) before continuing to type. This is a small but frequent friction that adds up across many paste operations.

## What Changes

- Single-line copy output (e.g., `@src/index.ts#10`) SHALL have a trailing space appended
- Multi-line copy output (bullet list) SHALL have a trailing newline appended

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `copy-path`: Add trailing whitespace to clipboard output — trailing space for single-line, trailing newline for multi-line

## Impact

- `src/extension.ts`: Modify the `copyPath` function to append trailing whitespace before writing to clipboard
- Existing tests will need updates to expect trailing whitespace in clipboard content
