## MODIFIED Requirements

### Requirement: Copy relative path in Claude Code format

The system SHALL provide a command that copies the active file's workspace-relative path, prefixed with `@`, to the system clipboard. When the user has an active text selection, the path SHALL include a line number suffix. When the user has multiple cursors, the system SHALL copy all cursor positions as a markdown bullet list with each line prefixed by `- `. For single-line output, the clipboard text SHALL have a trailing space appended. For multi-line output (multiple cursors), the clipboard text SHALL have a trailing newline appended.

#### Scenario: Copy relative path with no selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a file open and no text selected
- **THEN** the clipboard SHALL contain the workspace-relative path prefixed with `@` followed by a trailing space (e.g., `@src/index.ts `)

#### Scenario: Copy relative path with single-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a single-line selection on line 10
- **THEN** the clipboard SHALL contain `@src/index.ts#10 ` (with trailing space)

#### Scenario: Copy relative path with multi-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a selection spanning lines 10 to 12
- **THEN** the clipboard SHALL contain `@src/index.ts#10-12 ` (with trailing space)

#### Scenario: Copy relative path with multiple cursors on specific lines

- **WHEN** user executes "Copy Relative Path for Claude Code" with cursors on lines 10, 25, and 42 (no selection)
- **THEN** the clipboard SHALL contain:

  ```
  - @src/index.ts#10
  - @src/index.ts#25
  - @src/index.ts#42

  ```

  (with trailing newline)

#### Scenario: Copy relative path with multiple cursors with mixed selections

- **WHEN** user executes "Copy Relative Path for Claude Code" with a range selection on lines 10-15, a cursor on line 25, and a range selection on lines 42-50
- **THEN** the clipboard SHALL contain:

  ```
  - @src/index.ts#10-15
  - @src/index.ts#25
  - @src/index.ts#42-50

  ```

  (with trailing newline)

#### Scenario: Copy relative path without active editor

- **WHEN** user executes "Copy Relative Path for Claude Code" with no file open
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard

### Requirement: Copy absolute path in Claude Code format

The system SHALL provide a command that copies the active file's absolute filesystem path, prefixed with `@`, to the system clipboard. When the user has an active text selection, the path SHALL include a line number suffix. When the user has multiple cursors, the system SHALL copy all cursor positions as a markdown bullet list with each line prefixed by `- `. For single-line output, the clipboard text SHALL have a trailing space appended. For multi-line output (multiple cursors), the clipboard text SHALL have a trailing newline appended.

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

#### Scenario: Copy absolute path without active editor

- **WHEN** user executes "Copy Absolute Path for Claude Code" with no file open
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard
