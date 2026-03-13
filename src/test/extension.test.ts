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

suite("Strip Prefix", () => {
  let workspaceUri: vscode.Uri

  suiteSetup(() => {
    const folder = vscode.workspace.workspaceFolders?.[0]
    assert.ok(folder, "workspace folder must exist")
    workspaceUri = folder.uri
  })

  teardown(async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", undefined, vscode.ConfigurationTarget.Workspace)
  })

  test("prefix matches and is stripped", async () => {
    // The workspace-relative path for package.json is "package.json"
    // Set stripPrefix to "pack" to test stripping
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "pack", vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@age.json ")
  })

  test("prefix does not match leaves path unchanged", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "root/", vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json ")
  })

  test("empty prefix leaves path unchanged", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "", vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json ")
  })

  test("prefix equals entire path produces empty path", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "package.json", vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@ ")
  })

  test("prefix stripping with single-line selection", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "pack", vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(2, 0, 2, 5)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@age.json#3 ")
  })

  test("prefix stripping with multi-line selection", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "pack", vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(1, 0, 3, 5)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@age.json#2-4 ")
  })

  test("prefix stripping with multiple cursors", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "pack", vscode.ConfigurationTarget.Workspace)

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
    assert.strictEqual(clipboard, "- @age.json#1\n- @age.json#3\n- @age.json#5\n")
  })

  test("absolute path is unaffected by stripPrefix", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("stripPrefix", "pack", vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyAbsolutePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, `@${fileUri.fsPath} `)
  })
})

suite("Sort Paths Integration", () => {
  let workspaceUri: vscode.Uri

  suiteSetup(() => {
    const folder = vscode.workspace.workspaceFolders?.[0]
    assert.ok(folder, "workspace folder must exist")
    workspaceUri = folder.uri
  })

  teardown(async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("sortPaths", undefined, vscode.ConfigurationTarget.Workspace)
  })

  test("multi-cursor sorted when sortPaths enabled", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("sortPaths", true, vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selections = [
      new vscode.Selection(4, 0, 4, 0),
      new vscode.Selection(0, 0, 0, 0),
      new vscode.Selection(2, 0, 2, 0),
    ]

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "- @package.json#1\n- @package.json#3\n- @package.json#5\n")
  })

  test("multi-cursor preserves order when sortPaths disabled", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("sortPaths", false, vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)

    editor.selections = [
      new vscode.Selection(4, 0, 4, 0),
      new vscode.Selection(0, 0, 0, 0),
      new vscode.Selection(2, 0, 2, 0),
    ]

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "- @package.json#5\n- @package.json#1\n- @package.json#3\n")
  })

  test("single-item no-op with sort enabled", async () => {
    await vscode.workspace
      .getConfiguration("copy-path-for-claude-code")
      .update("sortPaths", true, vscode.ConfigurationTarget.Workspace)

    const fileUri = vscode.Uri.joinPath(workspaceUri, "package.json")
    const doc = await vscode.workspace.openTextDocument(fileUri)
    const editor = await vscode.window.showTextDocument(doc)
    editor.selection = new vscode.Selection(0, 0, 0, 0)

    await vscode.commands.executeCommand("copy-path-for-claude-code.copyRelativePath")
    const clipboard = await vscode.env.clipboard.readText()
    assert.strictEqual(clipboard, "@package.json ")
  })
})

suite("Keybinding When Clause", () => {
  // Read the extension's package.json to verify keybinding contributions
  let keybindings: { command: string; when?: string }[]

  suiteSetup(async () => {
    const ext = vscode.extensions.getExtension("arx8.copy-path-for-claude-code")
    assert.ok(ext, "extension must be found")
    keybindings = ext.packageJSON.contributes.keybindings ?? []
  })

  test("copyRelativePath keybinding has editorFocus when clause", () => {
    const binding = keybindings.find(
      (kb) => kb.command === "copy-path-for-claude-code.copyRelativePath",
    )
    assert.ok(binding, "keybinding for copyRelativePath must exist")
    assert.strictEqual(binding.when, "editorFocus")
  })

  test("copyAbsolutePath keybinding has editorFocus when clause", () => {
    const binding = keybindings.find(
      (kb) => kb.command === "copy-path-for-claude-code.copyAbsolutePath",
    )
    assert.ok(binding, "keybinding for copyAbsolutePath must exist")
    assert.strictEqual(binding.when, "editorFocus")
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
