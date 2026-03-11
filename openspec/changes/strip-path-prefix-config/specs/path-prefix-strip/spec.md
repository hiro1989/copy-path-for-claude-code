## ADDED Requirements

### Requirement: Strip prefix configuration setting

The extension SHALL provide a configuration setting `copy-path-for-claude-code.stripPrefix` of type `string` with a default value of `""`. The setting SHALL be registered with `resource` scope so it can be configured per workspace folder in multi-root workspaces.

#### Scenario: Setting exists with correct defaults

- **WHEN** the extension is installed and no user configuration is set
- **THEN** the `copy-path-for-claude-code.stripPrefix` setting SHALL have the value `""`

#### Scenario: Setting is configurable per workspace folder

- **WHEN** the user opens a multi-root workspace with folders A and B
- **THEN** the user SHALL be able to set different `stripPrefix` values for folder A and folder B

### Requirement: Prefix stripping applied to relative paths

When `copy-path-for-claude-code.stripPrefix` is non-empty and the workspace-relative path starts with the configured prefix, the system SHALL remove that prefix from the path before formatting the `@path` output. When the relative path does not start with the configured prefix, the path SHALL remain unchanged. The stripping SHALL NOT apply to absolute path copies.

#### Scenario: Prefix matches and is stripped

- **WHEN** `stripPrefix` is set to `"root/"` and the workspace-relative path is `root/.claude/rules/foo.md`
- **THEN** the formatted output SHALL use `.claude/rules/foo.md` as the path (e.g., `@.claude/rules/foo.md `)

#### Scenario: Prefix does not match

- **WHEN** `stripPrefix` is set to `"root/"` and the workspace-relative path is `other/src/index.ts`
- **THEN** the formatted output SHALL use `other/src/index.ts` as the path unchanged

#### Scenario: Prefix is empty

- **WHEN** `stripPrefix` is set to `""` (default)
- **THEN** the workspace-relative path SHALL be used unchanged

#### Scenario: Stripping does not apply to absolute paths

- **WHEN** `stripPrefix` is set to `"root/"` and the user copies an absolute path
- **THEN** the absolute path SHALL remain unchanged regardless of the prefix setting
