## Context

The `copyPath` function in `src/extension.ts` constructs a text string (`@path` with optional line suffix) and writes it to the clipboard. Single-line output is a plain string; multi-line output (multiple cursors) is a newline-joined bullet list. Currently, no trailing whitespace is appended.

## Goals / Non-Goals

**Goals:**

- Append a trailing space to single-line clipboard output so users can continue typing immediately after pasting
- Append a trailing newline to multi-line clipboard output for the same reason

**Non-Goals:**

- Making the trailing whitespace configurable (can be added later if needed)
- Changing the status bar feedback message format

## Decisions

- **Append whitespace at the end of `copyPath`, just before `clipboard.writeText`**: This keeps the formatting logic centralized. Alternative: append in each format branch — rejected because it scatters the logic.
- **Single line gets space, multi-line gets newline**: Matches natural typing flow. After a single `@path` reference you continue on the same line; after a bullet list you start a new line.

## Risks / Trade-offs

- Users who don't want trailing whitespace have no way to disable it. Mitigation: this is the common case; a setting can be added if feedback warrants it.
