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

  test("copyRelativePath appends line number for single-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(2, 0, 2, 5)
    await vscode.commands.executeCommand("claude-code-line-copy.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json#3")
  })

  test("copyRelativePath appends line range for multi-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(1, 0, 3, 5)
    await vscode.commands.executeCommand("claude-code-line-copy.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json#2-4")
  })

  test("copyAbsolutePath appends line number for single-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(4, 0, 4, 3)
    await vscode.commands.executeCommand("claude-code-line-copy.copyAbsolutePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath}#5`)
  })

  test("copyAbsolutePath appends line range for multi-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(0, 0, 2, 5)
    await vscode.commands.executeCommand("claude-code-line-copy.copyAbsolutePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath}#1-3`)
  })

  test("column-0 edge case adjusts end line", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    // Select lines 2-3 (0-indexed: 1-2), cursor at column 0 of line 4 (0-indexed: 3)
    editor.selection = new vscode.Selection(1, 0, 3, 0)
    await vscode.commands.executeCommand("claude-code-line-copy.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json#2-3")
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
