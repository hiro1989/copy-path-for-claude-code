## 1. Register commands in package.json

- [x] 1.1 Add `claude-code-line-copy.copyRelativePath` command with title "Copy Relative Path for Claude Code"
- [x] 1.2 Add `claude-code-line-copy.copyAbsolutePath` command with title "Copy Absolute Path for Claude Code"
- [x] 1.3 Remove the placeholder `helloWorld` command

## 2. Implement command handlers in extension.ts

- [x] 2.1 Implement `copyRelativePath` handler: get active editor, compute workspace-relative path, prefix with `@`, copy to clipboard
- [x] 2.2 Implement `copyAbsolutePath` handler: get active editor, get `fsPath`, prefix with `@`, copy to clipboard
- [x] 2.3 Add "no active editor" guard that shows an info message for both commands
- [x] 2.4 Remove the placeholder `helloWorld` handler

## 3. Test

- [x] 3.1 Write tests for `copyRelativePath`: verify clipboard contains `@` + relative path when editor is active
- [x] 3.2 Write tests for `copyAbsolutePath`: verify clipboard contains `@` + absolute path when editor is active
- [x] 3.3 Write tests for no-active-editor case: verify info message is shown and clipboard is not modified
- [x] 3.4 Run `pnpm test` to confirm all tests pass

## 4. Verify

- [x] 4.1 Run `pnpm compile` to confirm the build succeeds
- [x] 4.2 Run `pnpm lint` to confirm no lint errors
