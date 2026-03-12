import type vscode from "vscode"

/**
 * Convert a Selection to a line number string: `#line` or `#start-end`.
 * When the end cursor is at column 0 of a line past the start, the end line
 * is adjusted back by one (the user selected "up to" that line, not including it).
 */
export function formatLineNumber(_selection: vscode.Selection): string {
  throw new Error("Not implemented")
}

/**
 * Return a line-number suffix for clipboard output.
 * Returns an empty string when the selection is empty (cursor with no highlight),
 * otherwise delegates to the same logic as `formatLineNumber`.
 */
export function formatLineSuffix(_selection: vscode.Selection): string {
  throw new Error("Not implemented")
}

/**
 * Format a URI as `@path` for clipboard output.
 * Appends a trailing slash for directories.
 */
export async function formatExplorerPath(
  _uri: vscode.Uri,
  _getPath: (uri: vscode.Uri) => string,
): Promise<string> {
  throw new Error("Not implemented")
}
