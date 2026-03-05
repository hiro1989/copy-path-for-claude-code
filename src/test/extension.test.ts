import assert from "node:assert"

import vscode from "vscode"

suite("Copy Path Commands", () => {
  test("copyRelativePath copies @-prefixed relative path to clipboard", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    await vscode.window.showTextDocument(doc)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json ")
  })

  test("copyAbsolutePath copies @-prefixed absolute path to clipboard", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    await vscode.window.showTextDocument(doc)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyAbsolutePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath} `)
  })

  test("copyRelativePath appends line number for single-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(2, 0, 2, 5)
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json#3 ")
  })

  test("copyRelativePath appends line range for multi-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(1, 0, 3, 5)
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json#2-4 ")
  })

  test("copyAbsolutePath appends line number for single-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(4, 0, 4, 3)
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyAbsolutePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath}#5 `)
  })

  test("copyAbsolutePath appends line range for multi-line selection", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selection = new vscode.Selection(0, 0, 2, 5)
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyAbsolutePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath}#1-3 `)
  })

  test("column-0 edge case adjusts end line", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    // Select lines 2-3 (0-indexed: 1-2), cursor at column 0 of line 4 (0-indexed: 3)
    editor.selection = new vscode.Selection(1, 0, 3, 0)
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json#2-3 ")
  })

  test("successful copy updates clipboard without throwing", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    await vscode.window.showTextDocument(doc)

    // Reset selection and clipboard
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)
    await vscode.env.clipboard.writeText("")

    // Command should complete without throwing (try-catch wraps clipboard write)
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json ")
  })

  test("multi-cursor with no selection copies bullet list with line numbers", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selections = [
      new vscode.Selection(0, 0, 0, 0),
      new vscode.Selection(2, 0, 2, 0),
      new vscode.Selection(4, 0, 4, 0),
    ]

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "- @package.json#1\n- @package.json#3\n- @package.json#5\n")
  })

  test("multi-cursor with range selections copies bullet list with line ranges", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selections = [new vscode.Selection(0, 0, 1, 5), new vscode.Selection(3, 0, 5, 3)]

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "- @package.json#1-2\n- @package.json#4-6\n")
  })

  test("multi-cursor with mixed selections copies correct bullet list", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selections = [new vscode.Selection(0, 0, 2, 5), new vscode.Selection(4, 0, 4, 0)]

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "- @package.json#1-3\n- @package.json#5\n")
  })

  test("shows info message when no active editor", async () => {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors")

    // Write a known value to clipboard before running the command
    await vscode.env.clipboard.writeText("sentinel")

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "sentinel", "clipboard should not be modified")
  })
})

suite("Explorer Path Copy", () => {
  test("explorer single file copies relative path with trailing space", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath", fileUri, [
      fileUri,
    ])
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json ")
  })

  test("explorer single file copies absolute path with trailing space", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyAbsolutePath", fileUri, [
      fileUri,
    ])
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath} `)
  })

  test("explorer directory copies relative path with trailing slash", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const dirUri = vscode.Uri.joinPath(workspaceUri, "src")
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath", dirUri, [
      dirUri,
    ])
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@src/ ")
  })

  test("explorer directory copies absolute path with trailing slash", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const dirUri = vscode.Uri.joinPath(workspaceUri, "src")
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyAbsolutePath", dirUri, [
      dirUri,
    ])
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${dirUri.fsPath}/ `)
  })

  test("explorer multi-selection copies bullet list", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const dirUri = vscode.Uri.joinPath(workspaceUri, "src")
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath", fileUri, [
      fileUri,
      dirUri,
    ])
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "- @package.json\n- @src/\n")
  })

  test("explorer multi-selection absolute paths copies bullet list", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const dirUri = vscode.Uri.joinPath(workspaceUri, "src")
    await vscode.commands.executeCommand("copy-path-for-claude-code.copyAbsolutePath", fileUri, [
      fileUri,
      dirUri,
    ])
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `- @${fileUri.fsPath}\n- @${dirUri.fsPath}/\n`)
  })

  test("falls back to active editor when no Uri provided", async () => {
    const workspaceUri = vscode.workspace.workspaceFolders?.[0]?.uri
    assert.ok(workspaceUri, "workspace folder must exist")

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json ")
  })
})
