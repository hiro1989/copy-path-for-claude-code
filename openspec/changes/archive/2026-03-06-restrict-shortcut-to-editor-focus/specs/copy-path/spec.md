## ADDED Requirements

### Requirement: Shortcut keys restricted to editor focus

The extension's keybinding contributions for both copy commands SHALL include a `when` clause of `"editorFocus"`, so that the shortcuts only fire when a text editor has focus.

#### Scenario: Shortcut does not fire when Explorer is focused

- **WHEN** the Explorer panel has keyboard focus and the user presses the shortcut key for either copy command
- **THEN** the command SHALL NOT be invoked and the clipboard SHALL remain unchanged

#### Scenario: Shortcut fires normally when editor is focused

- **WHEN** a text editor has focus and the user presses the shortcut key for either copy command
- **THEN** the command SHALL execute as specified in the existing copy-path requirements
