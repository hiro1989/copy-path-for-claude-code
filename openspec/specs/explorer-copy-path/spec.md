# Explorer Copy Path

## Purpose

TBD

## Requirements

### Requirement: Copy relative path from explorer

The system SHALL allow copying workspace-relative paths of files and directories selected in the file explorer via the context menu. Directory paths SHALL have a trailing slash appended. For a single selection, the clipboard text SHALL have a trailing space appended. For multiple selections, the system SHALL copy all paths as a markdown bullet list with each line prefixed by `- ` and a trailing newline appended.

#### Scenario: Copy relative path of a single file from explorer

- **WHEN** user right-clicks a file in the explorer and selects "Copy Relative Path for Claude Code"
- **THEN** the clipboard SHALL contain the workspace-relative path prefixed with `@` followed by a trailing space (e.g., `@src/index.ts `)

#### Scenario: Copy relative path of a single directory from explorer

- **WHEN** user right-clicks a directory in the explorer and selects "Copy Relative Path for Claude Code"
- **THEN** the clipboard SHALL contain the workspace-relative path prefixed with `@` with a trailing slash and trailing space (e.g., `@src/components/ `)

#### Scenario: Copy relative paths of multiple items from explorer

- **WHEN** user selects multiple files and directories in the explorer and selects "Copy Relative Path for Claude Code"
- **THEN** the clipboard SHALL contain a markdown bullet list with each path prefixed by `- @` and a trailing newline (e.g., `- @src/foo.ts\n- @src/bar/\n`)

### Requirement: Copy absolute path from explorer

The system SHALL allow copying absolute filesystem paths of files and directories selected in the file explorer via the context menu. Directory paths SHALL have a trailing slash appended. For a single selection, the clipboard text SHALL have a trailing space appended. For multiple selections, the system SHALL copy all paths as a markdown bullet list with each line prefixed by `- ` and a trailing newline appended.

#### Scenario: Copy absolute path of a single file from explorer

- **WHEN** user right-clicks a file in the explorer and selects "Copy Absolute Path for Claude Code"
- **THEN** the clipboard SHALL contain the absolute path prefixed with `@` followed by a trailing space (e.g., `@/Users/john/project/src/index.ts `)

#### Scenario: Copy absolute path of a single directory from explorer

- **WHEN** user right-clicks a directory in the explorer and selects "Copy Absolute Path for Claude Code"
- **THEN** the clipboard SHALL contain the absolute path prefixed with `@` with a trailing slash and trailing space (e.g., `@/Users/john/project/src/components/ `)

#### Scenario: Copy absolute paths of multiple items from explorer

- **WHEN** user selects multiple files and directories in the explorer and selects "Copy Absolute Path for Claude Code"
- **THEN** the clipboard SHALL contain a markdown bullet list with each path prefixed by `- @` and a trailing newline

### Requirement: Explorer context menu registration

Both copy commands SHALL appear in the file explorer's context menu.

#### Scenario: Commands available in explorer context menu

- **WHEN** user right-clicks a file or directory in the explorer
- **THEN** both "Copy Relative Path for Claude Code" and "Copy Absolute Path for Claude Code" SHALL appear in the context menu
