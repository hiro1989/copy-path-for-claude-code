## Context

The extension copies file paths in `@path` format. The relative path is computed via `vscode.workspace.asRelativePath(uri)`. In monorepo setups where the VSCode workspace root is a parent directory, this produces paths like `root/.claude/rules/foo.md` instead of the desired `.claude/rules/foo.md`.

Currently the `getPath` callback is passed directly to `copyPath` with no transformation layer.

## Goals / Non-Goals

**Goals:**

- Allow users to configure a string prefix to strip from relative paths.
- Apply stripping before the `@` prefix is added, so all output formats (single path, multi-path list, line-numbered paths) benefit.

**Non-Goals:**

- Regex or glob-based path transformation.
- Regex or pattern-based per-folder overrides (the setting uses `resource` scope for basic multi-root support, but advanced per-folder logic is out of scope).
- Stripping prefixes from absolute paths.

## Decisions

### 1. Setting name and type

**Decision:** Add `copy-path-for-claude-code.stripPrefix` as a `string` setting, default `""`.

**Rationale:** A simple string match is the minimum viable approach. The user's described use case (removing `root/`) is a fixed prefix, not a pattern.

**Alternative considered:** An array of prefixes to try in order. Rejected as premature — a single prefix covers the stated use case.

### 2. Where to apply the stripping

**Decision:** Apply the prefix strip inside the `getPath` callback passed to `copyPath`, before any formatting. Specifically, wrap the relative path command's callback:

```typescript
;(u) => {
  let path = vscode.workspace.asRelativePath(u)
  const prefix = vscode.workspace
    .getConfiguration("copy-path-for-claude-code")
    .get<string>("stripPrefix", "")
  if (prefix && path.startsWith(prefix)) {
    path = path.slice(prefix.length)
  }
  return path
}
```

**Rationale:** This keeps the stripping logic in one place and ensures all downstream formatting (line numbers, trailing slashes, multi-select) uses the stripped path. No changes needed to `copyPath`'s signature or internals, nor to `formatExplorerPath`, `formatLineSuffix`, or `formatLineNumber`.

**Alternative considered:** A separate `transformPath` function called inside `copyPath`. Rejected — adding abstraction for a single `startsWith` + `slice` is unnecessary.

### 3. Configuration scope

**Decision:** Register the setting with `resource` scope in `package.json` so it can be set per workspace folder in multi-root workspaces.

**Rationale:** Different workspace folders in a multi-root setup may have different prefix needs.

## Risks / Trade-offs

- **Misconfigured prefix silently produces wrong paths** — If the user sets a prefix that does not match, the path is unchanged. This is the safest default behavior (no data loss, no error). Users can verify by checking clipboard output.
- **Config read on every copy** — Reading `getConfiguration` per invocation has negligible cost for a user-triggered command.
