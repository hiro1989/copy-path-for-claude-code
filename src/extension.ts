import vscode from "vscode"

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

async function copyPath(getPath: (editor: vscode.TextEditor) => string): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    vscode.window.showInformationMessage("No active editor found.")
    return
  }
  const suffix = formatLineSuffix(editor.selection)
  const text = `@${getPath(editor)}${suffix}`
  try {
    await vscode.env.clipboard.writeText(text)
    vscode.window.setStatusBarMessage(`Copied: ${text}`, 3000)
  } catch {
    vscode.window.showErrorMessage("Failed to copy.")
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("copy-path-for-claude-code.copyRelativePath", () =>
      copyPath((editor) => vscode.workspace.asRelativePath(editor.document.uri)),
    ),
    vscode.commands.registerCommand("copy-path-for-claude-code.copyAbsolutePath", () =>
      copyPath((editor) => editor.document.uri.fsPath),
    ),
  )
}

export function deactivate(): void {}
