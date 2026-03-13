## ADDED Requirements

### Requirement: Sort configuration option

The extension SHALL provide a boolean configuration option `copy-path-for-claude-code.sortPaths` with a default value of `false`. When set to `true`, multi-item copy output SHALL be sorted alphabetically before writing to the clipboard.

#### Scenario: Sort disabled by default

- **WHEN** user has not configured `sortPaths`
- **THEN** multi-item copy output SHALL preserve the original order provided by VSCode

#### Scenario: Sort enabled via settings

- **WHEN** user sets `sortPaths` to `true`
- **THEN** multi-item copy output SHALL be sorted alphabetically

### Requirement: Alphabetical sort for multi-file explorer copy

When `sortPaths` is `true` and multiple files or directories are selected in the explorer, the system SHALL sort the formatted path strings (the `@path` strings before the `- ` bullet prefix is added) alphabetically before writing to the clipboard.

#### Scenario: Multi-file explorer copy with sort enabled

- **WHEN** user copies multiple files from explorer with `sortPaths` set to `true` and the files in selection order are `cspell.json`, `.oxfmtrc.json`, `.tool-versions`
- **THEN** the clipboard SHALL contain:

  ```
  - @.oxfmtrc.json
  - @.tool-versions
  - @cspell.json

  ```

  (sorted alphabetically, with trailing newline)

#### Scenario: Multi-file explorer copy with sort disabled

- **WHEN** user copies multiple files from explorer with `sortPaths` set to `false` and the files in selection order are `cspell.json`, `.oxfmtrc.json`, `.tool-versions`
- **THEN** the clipboard SHALL contain:

  ```
  - @cspell.json
  - @.oxfmtrc.json
  - @.tool-versions

  ```

  (original selection order preserved, with trailing newline)

### Requirement: Alphabetical and numeric sort for multi-cursor editor copy

When `sortPaths` is `true` and multiple cursors are active in the editor, the system SHALL sort the formatted path strings (the `@path#line` strings before the `- ` bullet prefix is added) by file path alphabetically, then by start line number numerically, then by end line number numerically. Multi-cursor selections always belong to a single file in VSCode, so cross-file multi-cursor is out of scope.

#### Scenario: Multi-cursor copy with sort enabled, same file

- **WHEN** user copies with multiple cursors in `src/test/format.test.ts` with selections at lines 20-23, 13-14, 126-129, 126-127 and `sortPaths` is `true`
- **THEN** the clipboard SHALL contain:

  ```
  - @src/test/format.test.ts#13-14
  - @src/test/format.test.ts#20-23
  - @src/test/format.test.ts#126-127
  - @src/test/format.test.ts#126-129

  ```

  (sorted by start line numerically, then end line numerically, with trailing newline)

#### Scenario: Multi-cursor copy with sort disabled

- **WHEN** user copies with multiple cursors in `src/test/format.test.ts` with selections at lines 20-23, 13-14, 126-129, 126-127 and `sortPaths` is `false`
- **THEN** the clipboard SHALL contain:

  ```
  - @src/test/format.test.ts#20-23
  - @src/test/format.test.ts#13-14
  - @src/test/format.test.ts#126-129
  - @src/test/format.test.ts#126-127

  ```

  (original cursor order preserved, with trailing newline)

#### Scenario: Numeric sort avoids lexicographic ordering

- **WHEN** user copies with cursors on lines 9, 13, and 126 in `src/app.ts` and `sortPaths` is `true`
- **THEN** the clipboard SHALL contain:

  ```
  - @src/app.ts#9
  - @src/app.ts#13
  - @src/app.ts#126

  ```

  (sorted numerically, not lexicographically where 126 would precede 13, with trailing newline)

### Requirement: Single-item copy unaffected by sort setting

When only a single item is being copied (single file from explorer or single cursor in editor), the `sortPaths` setting SHALL have no effect on the output.

#### Scenario: Single file copy with sort enabled

- **WHEN** user copies a single file from explorer with `sortPaths` set to `true`
- **THEN** the clipboard output SHALL be identical to when `sortPaths` is `false`

#### Scenario: Single cursor copy with sort enabled

- **WHEN** user copies with a single cursor in the editor with `sortPaths` set to `true`
- **THEN** the clipboard output SHALL be identical to when `sortPaths` is `false`
