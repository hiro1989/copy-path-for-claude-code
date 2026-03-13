import type vscode from "vscode"

/**
 * Convert a Selection to a line number string: `#line` or `#start-end`.
 * When the end cursor is at column 0 of a line past the start, the end line
 * is adjusted back by one (the user selected "up to" that line, not including it).
 */
export function formatLineNumber(selection: vscode.Selection): string {
  const startLine = selection.start.line + 1
  let endLine = selection.end.line + 1
  if (selection.end.character === 0 && startLine < endLine) {
    endLine -= 1
  }
  if (startLine === endLine) {
    return `#${startLine}`
  }
  return `#${startLine}-${endLine}`
}

/**
 * Return a line-number suffix for clipboard output.
 * Returns an empty string when the selection is empty (cursor with no highlight),
 * otherwise delegates to the same logic as `formatLineNumber`.
 */
export function formatLineSuffix(selection: vscode.Selection): string {
  if (selection.isEmpty) {
    return ""
  }
  const startLine = selection.start.line + 1
  let endLine = selection.end.line + 1
  if (selection.end.character === 0 && startLine < endLine) {
    endLine -= 1
  }
  if (startLine === endLine) {
    return `#${startLine}`
  }
  return `#${startLine}-${endLine}`
}

/**
 * Format a URI as `@path` for clipboard output.
 * Appends a trailing slash for directories.
 */
/**
 * Sort an array of `@path` or `@path#line` strings alphabetically by path,
 * then numerically by start line and end line.
 */
export function sortPaths(paths: string[]): string[] {
  return paths
}

export async function formatExplorerPath(
  uri: vscode.Uri,
  getPath: (uri: vscode.Uri) => string,
): Promise<string> {
  const { workspace, FileType } = await import("vscode")
  const stat = await workspace.fs.stat(uri)
  const path = getPath(uri)
  const trailingSlash = stat.type & FileType.Directory ? "/" : ""
  return `@${path}${trailingSlash}`
}
