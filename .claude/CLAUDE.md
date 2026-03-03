# VSCode Extension for Claude Code Line Copy

## Project Overview

VSCode extension that copies the active file path (with optional line numbers) in Claude Code's `@path` format to the clipboard.

## Directory Structure

```
dist/      # Bundled extension output (esbuild)
openspec/  # Official product specification documents. Built with OpenSpec-style SDD (Specification Driven Development) — look here first for requirements and design decisions
out/       # Compiled test output (tsc)
src/       # Extension source code (TypeScript)
src/test/  # Test files (compiled by tsc to out/, run with @vscode/test-cli)
```

## Git Conventions

- **Branch naming:** `{issue-number}/{issue-title}` (e.g. `1234/implement-feature`)
- **Commit messages:** Follow Conventional Commits. Format: `<type>: <description>`. Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Language Policy

- Write **responses** (conversational replies to the user) in Japanese
- Write **thinking and tool use** (intermediate reasoning steps) in English
- Write **all artifacts** (code, documentation, etc.) in English

## Writing Style

- **Prefer short, clear bullet points or numbered lists over long prose.**
  - Never use Markdown tables in documents. Tables are allowed only in user-facing responses.
- **Use plain English words instead of ambiguous symbols.**
  - e.g. `A or B` not `A/B`, `use X instead of Y` not `X → Y`.

## Available Scripts

- `pnpm compile` — Bundle the extension with esbuild.
- `pnpm test` — Compile test files and run tests.
- `pnpm lint` — Run lint, format, and type check with autofix. Normally use this single command instead of running individual tools separately.

### Details

- Use `pnpm` as the package manager (not npm or npx).
- Extension code is bundled with esbuild, output goes to `dist/`.
- Test files are compiled with `tsc`, output goes to `out/`.
- Tests use `@vscode/test-cli` with mocha. Do not import `mocha` directly in test files — `suite`, `test`, etc. are provided globally by the test runner.

## Other Guidelines

- Use `AskUserQuestion` tool when necessary to clarify requirements or resolve ambiguities.
