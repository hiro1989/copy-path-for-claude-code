# VSCode Extension for Claude Code Line Copy

## Project Overview

TBD

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

## Other Guidelines

- Use `AskUserQuestion` tool when necessary to clarify requirements or resolve ambiguities.
