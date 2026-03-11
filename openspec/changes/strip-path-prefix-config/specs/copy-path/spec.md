## MODIFIED Requirements

### Requirement: Copy relative path in Claude Code format

The system SHALL provide a command that copies file paths in Claude Code's `@path` format to the system clipboard. When invoked from the file explorer with a `Uri` argument, the command SHALL use the provided URI. When no `Uri` argument is provided, the command SHALL fall back to the active text editor. When using the active editor, text selection and multi-cursor behavior SHALL remain unchanged. When the user has an active text selection, the path SHALL include a line number suffix. When the user has multiple cursors, the system SHALL copy all cursor positions as a markdown bullet list with each line prefixed by `- `. For single-line output, the clipboard text SHALL have a trailing space appended. For multi-line output (multiple cursors), the clipboard text SHALL have a trailing newline appended. Before formatting, the system SHALL apply prefix stripping as defined by the `path-prefix-strip` capability.

#### Scenario: Copy relative path with no selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a file open and no text selected
- **THEN** the clipboard SHALL contain the workspace-relative path (after prefix stripping) prefixed with `@` followed by a trailing space

#### Scenario: Copy relative path with single-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a single-line selection on line 10
- **THEN** the clipboard SHALL contain the stripped relative path prefixed with `@` and suffixed with `#10 ` (with trailing space)

#### Scenario: Copy relative path with multi-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a selection spanning lines 10 to 12
- **THEN** the clipboard SHALL contain the stripped relative path prefixed with `@` and suffixed with `#10-12 ` (with trailing space)

#### Scenario: Copy relative path with multiple cursors on specific lines

- **WHEN** user executes "Copy Relative Path for Claude Code" with cursors on lines 10, 25, and 42 (no selection)
- **THEN** the clipboard SHALL contain a markdown bullet list of stripped relative paths with line suffixes and a trailing newline

#### Scenario: Copy relative path with multiple cursors with mixed selections

- **WHEN** user executes "Copy Relative Path for Claude Code" with a range selection on lines 10-15, a cursor on line 25, and a range selection on lines 42-50
- **THEN** the clipboard SHALL contain a markdown bullet list of stripped relative paths with appropriate line suffixes and a trailing newline

#### Scenario: Copy relative path without active editor and without Uri argument

- **WHEN** user executes "Copy Relative Path for Claude Code" with no file open and no Uri argument
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard
