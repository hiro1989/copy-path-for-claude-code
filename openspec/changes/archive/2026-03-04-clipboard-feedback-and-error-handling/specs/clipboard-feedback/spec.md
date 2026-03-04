## MODIFIED Requirements

### Requirement: Success Feedback

After a path is copied to the clipboard, the user should see a brief confirmation message.

#### Scenario: Successful copy shows status message

- **WHEN** a copy command completes successfully
- **THEN** a status bar message is shown with the copied path text
- **AND** the message disappears automatically (no modal or persistent notification)

### Requirement: Error Handling

If the clipboard write fails, the user should be notified with an error message.

#### Scenario: Clipboard write failure shows error

- **WHEN** a copy command fails due to a clipboard error
- **THEN** an error message is shown to the user
- **AND** the error does not propagate as an unhandled exception
