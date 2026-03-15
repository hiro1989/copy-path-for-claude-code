---
name: changelog
description: Write or update the project's CHANGELOG.md. Use this skill whenever the user asks to update the changelog, add a changelog entry, document a new release, or prepare release notes — even if they don't say "changelog" explicitly. Trigger on phrases like "add to changelog", "update changelog", "write release notes", "document this version", "what changed in this release".
---

# Changelog Skill

Update the existing `CHANGELOG.md` at the project root. The changelog uses a simple bullet-point format — no tables, no lengthy descriptions.

## Format

```markdown
# Changelog

## [VERSION] - YYYY-MM-DD

- type: Short description
- type: Another change

## [OLDER_VERSION] - YYYY-MM-DD

- type: Description
```

- Each entry is a single `- type: description` line
- `type` follows Conventional Commits: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, etc.
- Versions are listed newest-first
- One blank line between sections, no extra blank lines

## How to determine what to write

1. Read `package.json` to get the current version
2. Read the existing `CHANGELOG.md`
3. Check git log for commits since the last changelog entry to identify changes
4. Ask the user if anything is unclear (e.g., which commits to include, what version to use)

## Rules

- Keep descriptions short — one line per change, no multi-line explanations
- If the version already has an entry in the changelog, append new bullet points to that section rather than creating a duplicate
- Use the date from today (or the date the user specifies) for new entries
- Do not add entries that are already listed
