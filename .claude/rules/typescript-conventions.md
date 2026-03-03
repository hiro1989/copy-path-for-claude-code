---
paths:
  - "**/*.{ts,tsx,js,jsx}"
---

# LSP (Language Server Protocol)

**🚨 CRITICAL: Always use LSP before `Read`, `Grep`, or `Glob` for any code exploration task.**

This project uses `typescript-lsp@claude-plugins-official` (project scope).

## When to Use Which Operation

Use LSP instead of `Read`, `Grep`, or `Glob` for the following:

- "Where is X defined?": use `goToDefinition`, not `Read` or `Grep`
- "Who uses X?" or before rename or refactor: use `findReferences`, not `Grep`
- "What type is this?" or "What does this JSDoc say?": use `hover`, not `Read` on the definition file
- "What functions/classes are in this file?": use `documentSymbol`, not `Read` + visual scan
- "Find a symbol across the whole project": use `workspaceSymbol`, not `Grep`
- "What interfaces does this implement?" or "Where are the implementations?": use `goToImplementation`, not `Grep`
- "What functions call X?": use `prepareCallHierarchy` then `incomingCalls`, not `Grep`
- "What does X call internally?": use `prepareCallHierarchy` then `outgoingCalls`, not `Read` + visual scan
- "Are there type errors?": use `mcp__ide__getDiagnostics` (VS Code only); if that's unavailable, run `pnpm tsc`

Fall back to `Read`, `Grep`, or `Glob` only when LSP returns no result (e.g. built-in types, external libraries).
When available, run `mcp__ide__getDiagnostics` (VS Code only) after editing type signatures, imports, or function parameters; otherwise run `pnpm tsc`.

# TypeScript Coding Conventions

## Comparison Operators

**Use `<` instead of `>`** following Code Complete convention.

```typescript
// ✅ Good
if (count < 10) {
}
if (0 < items.length) {
}

// ❌ Avoid
if (count > 10) {
}
if (items.length > 0) {
}
```
