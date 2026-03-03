# Copy Path

## Requirements

### Requirement: Copy relative path in Claude Code format

The system SHALL provide a command that copies the active file's workspace-relative path, prefixed with `@`, to the system clipboard. When the user has an active text selection, the path SHALL include a line number suffix.

#### Scenario: Copy relative path with no selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a file open and no text selected
- **THEN** the clipboard SHALL contain the workspace-relative path prefixed with `@` (e.g., `@src/index.ts`)

#### Scenario: Copy relative path with single-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a single-line selection on line 10
- **THEN** the clipboard SHALL contain `@src/index.ts#10`

#### Scenario: Copy relative path with multi-line selection

- **WHEN** user executes "Copy Relative Path for Claude Code" with a selection spanning lines 10 to 12
- **THEN** the clipboard SHALL contain `@src/index.ts#10-12`

#### Scenario: Copy relative path without active editor

- **WHEN** user executes "Copy Relative Path for Claude Code" with no file open
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard

### Requirement: Copy absolute path in Claude Code format

The system SHALL provide a command that copies the active file's absolute filesystem path, prefixed with `@`, to the system clipboard. When the user has an active text selection, the path SHALL include a line number suffix.

#### Scenario: Copy absolute path with no selection

- **WHEN** user executes "Copy Absolute Path for Claude Code" with a file open and no text selected
- **THEN** the clipboard SHALL contain the absolute path prefixed with `@` (e.g., `@/Users/john/project/src/index.ts`)

#### Scenario: Copy absolute path with single-line selection

- **WHEN** user executes "Copy Absolute Path for Claude Code" with a single-line selection on line 5
- **THEN** the clipboard SHALL contain `@/Users/john/project/src/index.ts#5`

#### Scenario: Copy absolute path with multi-line selection

- **WHEN** user executes "Copy Absolute Path for Claude Code" with a selection spanning lines 5 to 20
- **THEN** the clipboard SHALL contain `@/Users/john/project/src/index.ts#5-20`

#### Scenario: Copy absolute path without active editor

- **WHEN** user executes "Copy Absolute Path for Claude Code" with no file open
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard

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
