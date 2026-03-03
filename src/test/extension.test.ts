import assert from "node:assert"

import vscode from "vscode"

suite("Copy Path Commands", () => {
  test("copyRelativePath copies @-prefixed relative path to clipboard", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    await vscode.window.showTextDocument(doc)

    await vscode.commands.executeCommand("claude-code-line-copy.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json")
  })

  test("copyAbsolutePath copies @-prefixed absolute path to clipboard", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    await vscode.window.showTextDocument(doc)

    await vscode.commands.executeCommand("claude-code-line-copy.copyAbsolutePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath}`)
  })

  test("shows info message when no active editor", async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors")

    // Write a known value to clipboard before running the command
    await vscode.env.clipboard.writeText("sentinel")

    await vscode.commands.executeCommand("claude-code-line-copy.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "sentinel", "clipboard should not be modified")
  })
})
