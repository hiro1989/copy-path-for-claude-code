import vscode from "vscode"

function formatLineNumber(selection: vscode.Selection): string {
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

function formatLineSuffix(selection: vscode.Selection): string {
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

async function formatExplorerPath(
  uri: vscode.Uri,
  getPath: (uri: vscode.Uri) => string,
): Promise<string> {
  const stat = await vscode.workspace.fs.stat(uri)
  const path = getPath(uri)
  const trailingSlash = stat.type & vscode.FileType.Directory ? "/" : ""
  return `@${path}${trailingSlash}`
}

async function copyPath(
  getPath: (uri: vscode.Uri) => string,
  uri?: vscode.Uri,
  allUris?: vscode.Uri[],
): Promise<void> {
  let text: string
  let message: string

  if (uri) {
    // Explorer context menu invocation
    const uris = allUris && 1 < allUris.length ? allUris : [uri]
    if (1 < uris.length) {
      const paths = await Promise.all(uris.map((u) => formatExplorerPath(u, getPath)))
      text = `${paths.map((p) => `- ${p}`).join("\n")}\n`
      message = `Copied ${uris.length} paths`
    } else {
      const formatted = await formatExplorerPath(uri, getPath)
      text = `${formatted} `
      message = `Copied: ${formatted}`
    }
  } else {
    // Editor invocation (fallback)
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      vscode.window.showInformationMessage("No active editor found.")
      return
    }
    const path = getPath(editor.document.uri)
    if (1 < editor.selections.length) {
      text = `${editor.selections.map((s) => `- @${path}${formatLineNumber(s)}`).join("\n")}\n`
      message = `Copied ${editor.selections.length} lines`
    } else {
      const suffix = formatLineSuffix(editor.selection)
      text = `@${path}${suffix} `
      message = `Copied: ${text.trimEnd()}`
    }
  }

  try {
    await vscode.env.clipboard.writeText(text)
    vscode.window.setStatusBarMessage(message, 3000)
  } catch {
    vscode.window.showErrorMessage("Failed to copy.")
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "copy-path-for-claude-code.copyRelativePath",
      (uri?: vscode.Uri, allUris?: vscode.Uri[]) =>
        copyPath(
          (u) => {
            let path = vscode.workspace.asRelativePath(u)
            const prefix = vscode.workspace
              .getConfiguration("copy-path-for-claude-code")
              .get<string>("stripPrefix", "")
            if (prefix && path.startsWith(prefix)) {
              path = path.slice(prefix.length)
            }
            return path
          },
          uri,
          allUris,
        ),
    ),
    vscode.commands.registerCommand(
      "copy-path-for-claude-code.copyAbsolutePath",
      (uri?: vscode.Uri, allUris?: vscode.Uri[]) => copyPath((u) => u.fsPath, uri, allUris),
    ),
  )
}

export function deactivate(): void {}
