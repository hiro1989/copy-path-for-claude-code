## Why

When working in monorepo or nested workspace setups, the relative path from the VSCode workspace root includes a prefix (e.g., `root/`) that is irrelevant to Claude Code. Users need to strip this prefix so the copied `@path` matches what Claude Code expects.

## What Changes

- Add a new VSCode configuration setting that specifies a string prefix to strip from the beginning of copied relative paths.
- When the setting is non-empty and the relative path starts with that prefix, remove it before formatting the `@path` output.
- The setting applies only to relative path copies (not absolute paths).

## Capabilities

### New Capabilities

- `path-prefix-strip`: Configuration setting to remove a fixed prefix from copied relative paths.

### Modified Capabilities

- `copy-path`: Integrate prefix stripping into the relative path copy flow.

## Impact

- `src/extension.ts`: Modify `copyPath` and the relative path `getPath` callback to read the config and strip the prefix.
- `package.json`: Add `contributes.configuration` section for the new setting.
- No new dependencies required.
