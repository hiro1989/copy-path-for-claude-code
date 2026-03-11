# Copy Path

## Requirements

### Requirement: Copy relative path in Claude Code format

The system SHALL provide a command that copies file paths in Claude Code's `@path` format to the system clipboard. When invoked from the file explorer with a `Uri` argument, the command SHALL use the provided URI. When no `Uri` argument is provided, the command SHALL fall back to the active text editor. When using the active editor, text selection and multi-cursor behavior SHALL remain unchanged. When the user has an active text selection, the path SHALL include a line number suffix. When the user has multiple cursors, the system SHALL copy all cursor positions as a markdown bullet list with each line prefixed by `- `. For single-line output, the clipboard text SHALL have a trailing space appended. For multi-line output (multiple cursors), the clipboard text SHALL have a trailing newline appended. Before formatting, the system SHALL apply prefix stripping as defined by the `path-prefix-strip` capability.

#### Scenario: Copy relative path with no selection and prefix stripping

- **WHEN** user executes "Copy Relative Path for Claude Code" with `stripPrefix` set to `"root/"` and the workspace-relative path is `root/src/index.ts` with no text selected
- **THEN** the clipboard SHALL contain `@src/index.ts ` (with trailing space)

#### Scenario: Copy relative path with single-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with `stripPrefix` set to `"root/"`, workspace-relative path `root/src/index.ts`, and a single-line selection on line 10
- **THEN** the clipboard SHALL contain `@src/index.ts#10 ` (with trailing space)

#### Scenario: Copy relative path with multi-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with `stripPrefix` set to `"root/"`, workspace-relative path `root/src/index.ts`, and a selection spanning lines 10 to 12
- **THEN** the clipboard SHALL contain `@src/index.ts#10-12 ` (with trailing space)

#### Scenario: Copy relative path with multiple cursors on specific lines

- **WHEN** user executes "Copy Relative Path for Claude Code" with `stripPrefix` set to `"root/"`, workspace-relative path `root/src/index.ts`, and cursors on lines 10, 25, and 42 (no selection)
- **THEN** the clipboard SHALL contain:

  ```
  - @src/index.ts#10
  - @src/index.ts#25
  - @src/index.ts#42

  ```

  (with trailing newline)

#### Scenario: Copy relative path with multiple cursors with mixed selections

- **WHEN** user executes "Copy Relative Path for Claude Code" with `stripPrefix` set to `"root/"`, workspace-relative path `root/src/index.ts`, a range selection on lines 10-15, a cursor on line 25, and a range selection on lines 42-50
- **THEN** the clipboard SHALL contain:

  ```
  - @src/index.ts#10-15
  - @src/index.ts#25
  - @src/index.ts#42-50

  ```

  (with trailing newline)

#### Scenario: Copy relative path when prefix does not match

- **WHEN** user executes "Copy Relative Path for Claude Code" with `stripPrefix` set to `"root/"` and the workspace-relative path is `other/src/index.ts` with no text selected
- **THEN** the clipboard SHALL contain `@other/src/index.ts ` (path unchanged, with trailing space)

#### Scenario: Copy relative path without active editor and without Uri argument

- **WHEN** user executes "Copy Relative Path for Claude Code" with no file open and no Uri argument
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard

### Requirement: Copy absolute path in Claude Code format

The system SHALL provide a command that copies file paths as absolute filesystem paths in Claude Code's `@path` format to the system clipboard. When invoked from the file explorer with a `Uri` argument, the command SHALL use the provided URI. When no `Uri` argument is provided, the command SHALL fall back to the active text editor. When using the active editor, text selection and multi-cursor behavior SHALL remain unchanged. When the user has an active text selection, the path SHALL include a line number suffix. When the user has multiple cursors, the system SHALL copy all cursor positions as a markdown bullet list with each line prefixed by `- `. For single-line output, the clipboard text SHALL have a trailing space appended. For multi-line output (multiple cursors), the clipboard text SHALL have a trailing newline appended.

#### Scenario: Copy absolute path with no selection

- **WHEN** user executes "Copy Absolute Path for Claude Code" with a file open and no text selected
- **THEN** the clipboard SHALL contain the absolute path prefixed with `@` followed by a trailing space (e.g., `@/Users/john/project/src/index.ts `)

#### Scenario: Copy absolute path with single-line selection

- **WHEN** user executes "Copy Absolute Path for Claude Code" with a single-line selection on line 5
- **THEN** the clipboard SHALL contain `@/Users/john/project/src/index.ts#5 ` (with trailing space)

#### Scenario: Copy absolute path with multi-line selection

- **WHEN** user executes "Copy Absolute Path for Claude Code" with a selection spanning lines 5 to 20
- **THEN** the clipboard SHALL contain `@/Users/john/project/src/index.ts#5-20 ` (with trailing space)

#### Scenario: Copy absolute path with multiple cursors

- **WHEN** user executes "Copy Absolute Path for Claude Code" with cursors on lines 5, 10, and 20
- **THEN** the clipboard SHALL contain:

  ```
  - @/Users/john/project/src/index.ts#5
  - @/Users/john/project/src/index.ts#10
  - @/Users/john/project/src/index.ts#20

  ```

  (with trailing newline)

#### Scenario: Copy absolute path without active editor and without Uri argument

- **WHEN** user executes "Copy Absolute Path for Claude Code" with no file open and no Uri argument
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard

### Requirement: Multi-cursor status bar feedback

When copying with multiple cursors, the status bar message SHALL show the count of lines copied instead of the full text.

#### Scenario: Status bar message for multi-cursor copy

- **WHEN** user copies with 5 cursors active
- **THEN** the status bar SHALL display "Copied 5 lines"

### Requirement: Line number edge case handling

When a multi-line selection ends at column 0 of a line (common when selecting full lines), the system SHALL use the previous line as the effective end line.

#### Scenario: Selection ending at column 0 of next line

- **WHEN** user selects lines 10-12 and the cursor ends at column 0 of line 13
- **THEN** the line suffix SHALL be `#10-12` (not `#10-13`)

### Requirement: Commands registered in VSCode

The extension SHALL register both commands in `package.json` under `contributes.commands` so they appear in the Command Palette.

#### Scenario: Commands discoverable via Command Palette

- **WHEN** user opens the Command Palette and searches "Claude Code"
- **THEN** both "Copy Relative Path for Claude Code" and "Copy Absolute Path for Claude Code" SHALL appear as options

### Requirement: Shortcut keys restricted to editor focus

The extension's keybinding contributions for both copy commands SHALL include a `when` clause of `"editorFocus"`, so that the shortcuts only fire when a text editor has focus.

#### Scenario: Shortcut does not fire when Explorer is focused

- **WHEN** the Explorer panel has keyboard focus and the user presses the shortcut key for either copy command
- **THEN** the command SHALL NOT be invoked and the clipboard SHALL remain unchanged

#### Scenario: Shortcut fires normally when editor is focused

- **WHEN** a text editor has focus and the user presses the shortcut key for either copy command
- **THEN** the command SHALL execute as specified in the existing copy-path requirements
