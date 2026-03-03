## ADDED Requirements

### Requirement: Copy relative path in Claude Code format

The system SHALL provide a command that copies the active file's workspace-relative path, prefixed with `@`, to the system clipboard.

#### Scenario: Copy relative path with active editor

- **WHEN** user executes "Copy Relative Path for Claude Code" with a file open
- **THEN** the clipboard SHALL contain the workspace-relative path prefixed with `@` (e.g., `@src/index.ts`)

#### Scenario: Copy relative path without active editor

- **WHEN** user executes "Copy Relative Path for Claude Code" with no file open
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard

### Requirement: Copy absolute path in Claude Code format

The system SHALL provide a command that copies the active file's absolute filesystem path, prefixed with `@`, to the system clipboard.

#### Scenario: Copy absolute path with active editor

- **WHEN** user executes "Copy Absolute Path for Claude Code" with a file open
- **THEN** the clipboard SHALL contain the absolute path prefixed with `@` (e.g., `@/Users/john/project/src/index.ts`)

#### Scenario: Copy absolute path without active editor

- **WHEN** user executes "Copy Absolute Path for Claude Code" with no file open
- **THEN** the system SHALL show an informational message and SHALL NOT modify the clipboard

### Requirement: Commands registered in VSCode

The extension SHALL register both commands in `package.json` under `contributes.commands` so they appear in the Command Palette.

#### Scenario: Commands discoverable via Command Palette

- **WHEN** user opens the Command Palette and searches "Claude Code"
- **THEN** both "Copy Relative Path for Claude Code" and "Copy Absolute Path for Claude Code" SHALL appear as options
