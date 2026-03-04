## 1. Add error handling and success feedback

- [ ] 1.1 Wrap `copyRelativePath` clipboard write in try-catch. Success: `setStatusBarMessage("Copied: @<path><suffix>", 3000)`. Failure: `showErrorMessage("Failed to copy.")`
- [ ] 1.2 Wrap `copyAbsolutePath` clipboard write in try-catch. Same messages as 1.1

## 2. Verify

- [ ] 2.1 Run existing tests to ensure no regressions
- [ ] 2.2 Run lint
