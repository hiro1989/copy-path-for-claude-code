import vscode from "vscode"

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("claude-code-line-copy.copyRelativePath", async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage("No active editor found.")
        return
      }
      const relativePath = vscode.workspace.asRelativePath(editor.document.uri)
      await vscode.env.clipboard.writeText(`@${relativePath}`)
    }),

    vscode.commands.registerCommand("claude-code-line-copy.copyAbsolutePath", async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage("No active editor found.")
        return
      }
      await vscode.env.clipboard.writeText(`@${editor.document.uri.fsPath}`)
    }),
  )
}

export function deactivate(): void {}
