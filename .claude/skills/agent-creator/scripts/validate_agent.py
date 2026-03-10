#!/usr/bin/env python3
"""Validate a custom subagent file (.md) for .claude/agents/.

Checks both YAML frontmatter (name, description, known fields) and
body structure (Role, Inputs, Process, Output Format, Guidelines).

Usage:
    python validate_agent.py <path-to-agent.md> [path-to-agent.md ...]

Exit codes:
    0 - All checks passed (may have warnings)
    1 - One or more errors found

Reference: https://code.claude.com/docs/en/sub-agents
"""

import re
import sys
from pathlib import Path

# --- Constants ---

# Required frontmatter fields
REQUIRED_FRONTMATTER = {"name", "description"}

# All known frontmatter fields for custom subagents
KNOWN_FRONTMATTER = {
    "name",
    "description",
    "tools",
    "disallowedTools",
    "model",
    "permissionMode",
    "maxTurns",
    "skills",
    "mcpServers",
    "hooks",
    "memory",
    "background",
    "isolation",
    "color",
}

# Enum constraints for optional fields
ENUM_FIELDS: dict[str, set[str]] = {
    "model": {"sonnet", "opus", "haiku", "inherit"},
    "permissionMode": {"default", "acceptEdits", "dontAsk", "bypassPermissions", "plan"},
    "memory": {"user", "project", "local"},
    "isolation": {"worktree"},
    "color": {"red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"},
}

# Boolean fields
BOOL_FIELDS = {"background"}

# name: kebab-case, max 64 chars
NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
NAME_MAX_LEN = 64

# description: max 1024 chars
DESCRIPTION_MAX_LEN = 1024

# Required H2 sections in the body (system prompt)
REQUIRED_SECTIONS = {"Role", "Inputs", "Process", "Output Format"}

# Recommended H2 sections
RECOMMENDED_SECTIONS = {"Guidelines"}

# Body line count recommendation (based on existing agents: grader ~215, comparator ~203)
RECOMMENDED_MAX_BODY_LINES = 300


# --- Helpers ---


class Issue:
    def __init__(self, level: str, message: str):
        self.level = level  # "error" or "warning"
        self.message = message

    def __str__(self):
        tag = "ERROR" if self.level == "error" else "WARN"
        return f"  [{tag}] {self.message}"


# --- Frontmatter ---


def parse_frontmatter(text: str) -> tuple[dict | None, str, list[Issue]]:
    """Extract YAML frontmatter and body from the file.

    Returns (fields_dict, body, issues).
    fields_dict is None if no frontmatter block is found.
    """
    issues: list[Issue] = []

    if not text.startswith("---"):
        issues.append(Issue("error", "No frontmatter found. File must start with '---'."))
        return None, text, issues

    # Find closing delimiter
    end_match = re.search(r"\n---\s*\n", text[3:])
    if end_match is None:
        end_match = re.search(r"\n---\s*$", text[3:])
        if end_match is None:
            issues.append(Issue("error", "Frontmatter not closed. Missing closing '---'."))
            return None, text, issues

    raw_yaml = text[3 : 3 + end_match.start()]
    body = text[3 + end_match.end() :]

    # Parse YAML (simple key: value, no external deps)
    fields: dict = {}
    current_key = None
    for line_num, line in enumerate(raw_yaml.strip().splitlines(), start=2):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        kv_match = re.match(r"^([a-zA-Z][a-zA-Z0-9_-]*)\s*:\s*(.*)", line)
        if kv_match:
            key = kv_match.group(1)
            value = kv_match.group(2).strip()
            if (value.startswith('"') and value.endswith('"')) or (
                value.startswith("'") and value.endswith("'")
            ):
                value = value[1:-1]
            fields[key] = value
            current_key = key
        elif current_key and line.startswith(("  ", "\t")):
            if isinstance(fields[current_key], str) and fields[current_key]:
                fields[current_key] += " " + stripped
            else:
                fields[current_key] = stripped
        else:
            issues.append(
                Issue("warning", f"Line {line_num}: Could not parse frontmatter line: {stripped}")
            )

    return fields, body, issues


def validate_frontmatter(fields: dict) -> list[Issue]:
    """Validate frontmatter fields."""
    issues: list[Issue] = []

    # Required fields
    for field in sorted(REQUIRED_FRONTMATTER):
        if field not in fields:
            issues.append(Issue("error", f"Required frontmatter field '{field}' is missing."))
        elif not fields[field]:
            issues.append(Issue("error", f"Frontmatter field '{field}' must not be empty."))

    # Unknown fields
    for field in fields:
        if field not in KNOWN_FRONTMATTER:
            issues.append(Issue("error", f"Unknown frontmatter field '{field}'."))

    # name validation
    if "name" in fields and fields["name"]:
        name = fields["name"]
        if len(name) > NAME_MAX_LEN:
            issues.append(
                Issue("error", f"Field 'name' is {len(name)} chars (max {NAME_MAX_LEN}).")
            )
        if not NAME_PATTERN.match(name):
            issues.append(
                Issue(
                    "error",
                    f"Field 'name' must be kebab-case (^[a-z0-9]+(-[a-z0-9]+)*$): '{name}'.",
                )
            )

    # description validation
    if "description" in fields and fields["description"]:
        desc = fields["description"]
        if len(desc) > DESCRIPTION_MAX_LEN:
            issues.append(
                Issue(
                    "error",
                    f"Field 'description' is {len(desc)} chars (max {DESCRIPTION_MAX_LEN}).",
                )
            )
        if "<" in desc or ">" in desc:
            issues.append(
                Issue("error", "Field 'description' must not contain angle brackets (< >).")
            )

    # Enum field validation
    for field, allowed in ENUM_FIELDS.items():
        if field in fields and fields[field] and fields[field] not in allowed:
            issues.append(
                Issue(
                    "error",
                    f"Field '{field}' must be one of {sorted(allowed)}, got '{fields[field]}'.",
                )
            )

    # Boolean field validation
    for field in BOOL_FIELDS:
        if field in fields and fields[field] not in ("true", "false", ""):
            issues.append(
                Issue(
                    "error",
                    f"Field '{field}' must be true or false, got '{fields[field]}'.",
                )
            )

    # maxTurns: positive integer
    if "maxTurns" in fields and fields["maxTurns"]:
        val = fields["maxTurns"]
        if not val.isdigit() or int(val) <= 0:
            issues.append(
                Issue("error", f"Field 'maxTurns' must be a positive integer, got '{val}'.")
            )

    # tools: comma-separated tool names, each optionally with a glob pattern in parens.
    # Examples: "Read, Grep, Glob", "Bash(git *)", "Read, Bash(npm *), mcp__server__tool"
    if "tools" in fields:
        tools_val = fields["tools"]
        if not tools_val:
            issues.append(Issue("error", "Field 'tools' must not be empty if present."))
        else:
            # Each entry: ToolName or ToolName(pattern) or mcp__server__tool
            tool_entry = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*(\(.*\))?$")
            entries = [e.strip() for e in tools_val.split(",")]
            for entry in entries:
                if not entry:
                    issues.append(
                        Issue("error", "Field 'tools' has an empty entry (trailing comma?).")
                    )
                elif not tool_entry.match(entry):
                    issues.append(
                        Issue(
                            "error",
                            f"Field 'tools' has invalid entry '{entry}'. "
                            "Expected: ToolName or ToolName(pattern).",
                        )
                    )

    # List-of-strings fields: should not be empty if present.
    # Full list parsing is not feasible with a simple YAML parser,
    # but we can catch obviously empty values.
    for field in ("disallowedTools", "skills"):
        if field in fields and not fields[field]:
            issues.append(Issue("error", f"Field '{field}' must not be empty if present."))

    # Dict fields: should not be empty if present.
    # Structural validation of nested YAML is beyond this simple parser.
    for field in ("mcpServers", "hooks"):
        if field in fields and not fields[field]:
            issues.append(Issue("error", f"Field '{field}' must not be empty if present."))

    return issues


# --- Body (system prompt) ---


def extract_headings(text: str) -> tuple[str | None, list[str]]:
    """Extract H1 title and all H2 section names."""
    h1 = None
    h2s: list[str] = []

    for line in text.splitlines():
        stripped = line.strip()
        if h1 is None:
            m = re.match(r"^#\s+(.+)$", stripped)
            if m:
                h1 = m.group(1).strip()
                continue
        m = re.match(r"^##\s+(.+)$", stripped)
        if m:
            h2s.append(m.group(1).strip())

    return h1, h2s


def get_section_content(text: str, section_name: str) -> str | None:
    """Extract content under a specific H2 section."""
    pattern = rf"^##\s+{re.escape(section_name)}\s*$"
    lines = text.splitlines()
    start = None

    for i, line in enumerate(lines):
        if re.match(pattern, line.strip()):
            start = i + 1
            break

    if start is None:
        return None

    content_lines = []
    for line in lines[start:]:
        if re.match(r"^##\s+", line.strip()):
            break
        content_lines.append(line)

    return "\n".join(content_lines)


def validate_body(body: str) -> list[Issue]:
    """Validate the body (system prompt) structure."""
    issues: list[Issue] = []

    body_stripped = body.strip()
    if not body_stripped:
        issues.append(Issue("error", "Body is empty. The body is the agent's system prompt."))
        return issues

    # H1 heading
    h1, h2s = extract_headings(body_stripped)
    if h1 is None:
        issues.append(Issue("error", "Missing H1 heading in body. Start with '# Agent Name'."))

    # Required H2 sections
    h2_set = set(h2s)
    for section in sorted(REQUIRED_SECTIONS):
        if section not in h2_set:
            issues.append(Issue("error", f"Missing required section: '## {section}'."))

    for section in sorted(RECOMMENDED_SECTIONS):
        if section not in h2_set:
            issues.append(Issue("warning", f"Missing recommended section: '## {section}'."))

    # Inputs section: parameter definitions
    inputs_content = get_section_content(body_stripped, "Inputs")
    if inputs_content is not None:
        params = re.findall(r"^\s*[-*]\s+\*\*(\w+)\*\*", inputs_content, re.MULTILINE)
        if not params:
            issues.append(
                Issue(
                    "warning",
                    "Inputs section has no parameter definitions. "
                    "Expected: '- **param_name**: description'.",
                )
            )

    # Output Format section: code block
    output_content = get_section_content(body_stripped, "Output Format")
    if output_content is not None and "```" not in output_content:
        issues.append(
            Issue(
                "warning",
                "Output Format section has no code block. "
                "Include a concrete example of the expected output.",
            )
        )

    # Process section: step headings
    process_content = get_section_content(body_stripped, "Process")
    if process_content is not None:
        steps = re.findall(r"^###\s+", process_content, re.MULTILINE)
        if not steps:
            issues.append(
                Issue(
                    "warning",
                    "Process section has no step headings (### Step N: ...). "
                    "Break the process into discrete steps.",
                )
            )

    # Line count
    body_lines = len(body_stripped.splitlines())
    if body_lines > RECOMMENDED_MAX_BODY_LINES:
        issues.append(
            Issue(
                "warning",
                f"Body is {body_lines} lines (recommended max {RECOMMENDED_MAX_BODY_LINES}). "
                "Consider splitting into smaller agents or reference files.",
            )
        )

    return issues


# --- Main ---


def validate(path: str) -> int:
    """Validate a subagent file. Returns 0 on success, 1 on errors."""
    agent_path = Path(path)

    if not agent_path.exists():
        print(f"File not found: {path}")
        return 1

    text = agent_path.read_text(encoding="utf-8")
    all_issues: list[Issue] = []

    # Parse and validate frontmatter
    fields, body, parse_issues = parse_frontmatter(text)
    all_issues.extend(parse_issues)

    if fields is not None:
        all_issues.extend(validate_frontmatter(fields))

    # Validate body
    all_issues.extend(validate_body(body))

    # Report
    errors = [i for i in all_issues if i.level == "error"]
    warnings = [i for i in all_issues if i.level == "warning"]

    if not all_issues:
        print(f"OK: {path}")
        return 0

    print(f"Validating: {path}")
    for issue in all_issues:
        print(str(issue))

    summary_parts = []
    if errors:
        summary_parts.append(f"{len(errors)} error(s)")
    if warnings:
        summary_parts.append(f"{len(warnings)} warning(s)")
    print(f"  {', '.join(summary_parts)}")

    return 1 if errors else 0


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <agent.md> [agent.md ...]")
        sys.exit(1)

    exit_code = 0
    for path in sys.argv[1:]:
        result = validate(path)
        if result != 0:
            exit_code = result

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
