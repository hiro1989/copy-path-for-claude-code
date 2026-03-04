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

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("copy-path-for-claude-code.copyRelativePath", async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage("No active editor found.")
        return
      }
      const relativePath = vscode.workspace.asRelativePath(editor.document.uri)
      const suffix = formatLineSuffix(editor.selection)
      const text = `@${relativePath}${suffix}`
      try {
        await vscode.env.clipboard.writeText(text)
        vscode.window.setStatusBarMessage(`Copied: ${text}`, 3000)
      } catch {
        vscode.window.showErrorMessage("Failed to copy.")
      }
    }),

    vscode.commands.registerCommand("copy-path-for-claude-code.copyAbsolutePath", async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage("No active editor found.")
        return
      }
      const suffix = formatLineSuffix(editor.selection)
      const text = `@${editor.document.uri.fsPath}${suffix}`
      try {
        await vscode.env.clipboard.writeText(text)
        vscode.window.setStatusBarMessage(`Copied: ${text}`, 3000)
      } catch {
        vscode.window.showErrorMessage("Failed to copy.")
      }
    }),
  )
}

export function deactivate(): void {}
