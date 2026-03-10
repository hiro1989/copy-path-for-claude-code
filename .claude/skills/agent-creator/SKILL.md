---
name: agent-creator
description: Create Claude Code custom subagent files (.md) in .claude/agents/. Use when users want to create a new subagent, design agent prompts, build specialized agents for parallel tasks, or define reusable agent types. Trigger whenever the user mentions creating agents, subagents, agent prompts, or agent .md files.
---

# Agent Creator

Create custom subagent files for `.claude/agents/`.

## What is a custom subagent?

A custom subagent is a reusable agent type defined as a `.md` file in `.claude/agents/` (project-level) or `~/.claude/agents/` (user-level). Claude Code auto-registers these files and can delegate tasks to them based on their `description`.

Each file consists of:

- **YAML frontmatter**: metadata (`name`, `description`, etc.) that controls how Claude discovers and spawns the agent
- **Markdown body**: the system prompt that defines the agent's behavior

Reference: https://code.claude.com/docs/en/sub-agents

## When to create a custom subagent

- **Create one** when the task is independent, reusable, or benefits from context isolation
- **Don't create one** when the task is simple, one-off, or needs the main conversation context
- **Use a script instead** when the task is deterministic and doesn't need LLM reasoning

## Creating a subagent file

### Step 1: Understand the purpose

Ask the user:

1. What task should this agent perform?
2. What inputs will it receive?
3. What outputs should it produce?
4. Will it be spawned once or multiple times in parallel?

If the user has already described the task in conversation, extract answers from context first.

### Step 2: Design the file structure

A subagent file has two parts: frontmatter and body.

**Frontmatter** (YAML between `---` delimiters):

```yaml
---
name: agent-name
description: What this agent does and when to delegate to it.
color: green
---
```

## Frontmatter Schema

| Field             | Required | Type                   | Constraints                                                              |
| ----------------- | -------- | ---------------------- | ------------------------------------------------------------------------ |
| `name`            | Yes      | string                 | kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`), max 64 chars                    |
| `description`     | Yes      | string                 | max 1024 chars, no angle brackets. Primary trigger for auto-delegation   |
| `tools`           | No       | comma-separated string | Restrict available tools (default: inherit all). e.g. `Read, Grep, Glob` |
| `disallowedTools` | No       | list of strings        | Deny specific tools                                                      |
| `model`           | No       | enum                   | `sonnet`, `opus`, `haiku`, `inherit` (default: `inherit`)                |
| `permissionMode`  | No       | enum                   | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`         |
| `maxTurns`        | No       | int                    | positive integer                                                         |
| `skills`          | No       | list of strings        | Preload specific skills                                                  |
| `mcpServers`      | No       | dict                   | Server name to config mapping                                            |
| `hooks`           | No       | dict                   | Event hooks: `PreToolUse`, `PostToolUse`, `Stop`, etc.                   |
| `memory`          | No       | enum                   | `user`, `project`, `local`                                               |
| `background`      | No       | bool                   | Run in background (default: `false`)                                     |
| `isolation`       | No       | enum                   | `worktree` only                                                          |
| `color`           | No       | enum                   | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan`     |

**Body** (markdown after frontmatter):

The body is the agent's system prompt. Follow this anatomy:

````markdown
# [Agent Name]

[One-line description of what it does.]

## Role

[2-3 sentences explaining the agent's purpose and perspective.]

## Inputs

You receive these parameters in your prompt:

- **param_name**: Description of what this parameter contains
- **another_param**: Description

## Process

### Step 1: [First action]

1. Concrete instruction
2. Another instruction

### Step 2: [Second action]

...

### Step N: Write Output

Save results to `{output_path}`.

## Output Format

Write a JSON file with this structure:

```json
{
  "field": "example value"
}
```

## Guidelines

- **Be specific**: [domain-specific guidance]
- **Be thorough**: [quality bar]
````

### Step 3: Write the file

Follow these principles:

**Structure**

- Start with a clear Role section that sets the agent's perspective
- List all inputs explicitly so the agent knows what it receives
- Break the process into numbered steps with concrete instructions
- Define the output format with a complete JSON example
- End with guidelines that set quality expectations
- Always include `color` in the frontmatter. If the user does not specify a color, pick one at random from the allowed values

**Clarity**

- Write instructions in imperative form ("Read the file", not "You should read the file")
- Be specific about file paths — use parameter placeholders like `{output_path}`
- Explain the "why" behind important instructions so the agent can adapt to edge cases
- Avoid vague instructions like "process appropriately" — spell out what "appropriate" means

**Robustness**

- Include what to do when expected inputs are missing or malformed
- Specify pass/fail criteria clearly when the agent makes judgments
- Tell the agent what NOT to do when it matters (e.g., "Do not modify the input files")

**Output**

- Always define a structured output format (JSON preferred)
- Include field descriptions for non-obvious fields
- Show a realistic example, not just a schema

### Step 4: Place the file

Save to `.claude/agents/<agent-name>.md` in the project root. Claude Code auto-registers it on next invocation.

### Step 5: Validate

After writing or editing, always run the validator:

```bash
python <agent-creator-skill-path>/scripts/validate_agent.py <path-to-agent.md>
```

Fix all errors before moving on. Warnings are advisory but worth reviewing.

### Step 6: Test the agent (optional)

If the user wants to verify the agent works:

1. Write a simple test prompt that exercises the agent
2. Spawn the agent via the Agent tool with `subagent_type` set to the agent's name
3. Review the output together with the user
4. Iterate on the prompt if needed — rerun the validator after each edit

## How Claude discovers and spawns subagents

Once a file is in `.claude/agents/`, Claude can delegate tasks to it automatically based on the `description`. It can also be spawned explicitly:

```
Agent tool call:
  prompt: |
    Execute this task:
    - param_name: <value>
    - output_path: <value>
  subagent_type: agent-name
  description: "Short task summary"
```

## Common patterns

### Parallel fan-out

Spawn the same agent N times with different inputs. Useful for grading, analysis, or processing multiple items.

### Pipeline

Chain agents where one's output is another's input. Spawn them sequentially, passing output paths.

### Judge pattern

Two agents produce competing outputs, a third agent judges which is better without knowing the source.

## Validation

Always run the validator after creating or editing an agent file. This is not optional — do not skip it.

```bash
python <agent-creator-skill-path>/scripts/validate_agent.py <path-to-agent.md>
```

Fix all errors before presenting the result to the user. The validator checks:

Frontmatter:

- Frontmatter exists with required fields (`name`, `description`)
- Unknown frontmatter fields are flagged as errors
- `name`: kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*$`), max 64 chars
- `description`: non-empty, max 1024 chars, no angle brackets
- `tools`: comma-separated `ToolName` or `ToolName(pattern)` entries (e.g. `Read, Bash(git *)`)
- `disallowedTools`, `skills`: must not be empty if present
- `mcpServers`, `hooks`: must not be empty if present
- Enum fields (`model`, `permissionMode`, `memory`, `isolation`, `color`): value in allowed set
- `background`: boolean (`true` or `false`)
- `maxTurns`: positive integer

Body (system prompt):

- Required sections: Role, Inputs, Process, Output Format
- Recommended section: Guidelines
- Inputs section has parameter definitions (`- **param_name**: ...`)
- Output Format section has a code block
- Process section has step headings (`### Step N: ...`)
- Line count warning if body exceeds 300 lines

Exit code 0 means all checks passed (warnings may still appear). Exit code 1 means errors were found.

## Guidelines

- Keep agents focused on a single responsibility
- Prefer structured JSON output over free-form text — easier to consume programmatically
- Include realistic examples in the output format section
- Test with edge cases before relying on the agent in production workflows
