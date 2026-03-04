---
paths:
  - "openspec/**/*"
---

# OpenSpec (SDD: Specification Driven Development)

OpenSpec is this project's SDD system. Changes are managed through artifacts that capture thinking (why, what, how) before implementation.

## Directory Structure

All paths below are relative to `openspec/`.

```
config.yaml                                       # Project-level config: default schema, AI context, per-artifact rules
specs/{capability}/spec.md                        # Main spec — authoritative requirements for a capability
changes/{change-name}/.openspec.yaml              # Change metadata: schema used, creation date
changes/{change-name}/proposal.md                 # WHY: problem, scope, affected capabilities, file impact
changes/{change-name}/design.md                   # HOW: technical decisions, goals/non-goals, architecture rationale
changes/{change-name}/specs/{capability}/spec.md  # Delta spec — changes to sync into main specs after implementation
changes/{change-name}/tasks.md                    # Implementation checklist: checkboxes tracking pending/done work
changes/archive/YYYY-MM-DD-{change-name}/         # Completed changes, same structure as above
```

## Artifacts

When creating or editing an artifact, read its template file first and follow it closely.

### 0. `config.yaml`

- Default schema, AI context hints, per-artifact rules

### 1. `changes/{change-name}/proposal.md`

- **WHY** the change exists
- Problem or opportunity, scope, affected capabilities, system impact

### 2. `changes/{change-name}/design.md`

- **HOW** the change is implemented
- Current state context, goals/non-goals, key decisions with rationale
- Read this to understand why the implementation was done a certain way

### 3. `changes/{change-name}/specs/{capability}/spec.md` (delta spec)

- **Delta spec** — changes relative to the main spec
- Sections: ADDED / MODIFIED / REMOVED / RENAMED Requirements
- Merged into `specs/{capability}/spec.md` (main spec) via `/opsx:sync` after implementation
- Used by `openspec` CLI during the `specs` artifact phase

### 4. `changes/{change-name}/tasks.md`

- Checklist of all tasks needed to complete the change: implementation, tests, migrations, etc.

### 5. `changes/archive/YYYY-MM-DD-{change-name}/`

- Completed change, same structure as an active change
- Decision record — useful for understanding historical context

### 6. `specs/{capability}/spec.md` (main spec)

- Authoritative requirements for a capability — single source of truth
- SHALL/MUST statements with named WHEN/THEN/AND scenarios
- Created/updated by `/opsx:sync` when delta specs are merged
