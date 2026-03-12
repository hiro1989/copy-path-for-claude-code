import assert from "node:assert"

import vscode from "vscode"

import { formatLineNumber } from "../format"

suite("formatLineNumber", () => {
  test("single line selection returns #line", () => {
    const selection = new vscode.Selection(2, 0, 2, 5)
    assert.strictEqual(formatLineNumber(selection), "#3")
  })

  test("multi-line selection returns #start-end", () => {
    const selection = new vscode.Selection(1, 0, 3, 5)
    assert.strictEqual(formatLineNumber(selection), "#2-4")
  })

  test("column-0 edge case adjusts end line back by one", () => {
    // Cursor at column 0 of line 4 (0-indexed: 3) means user selected up to line 3
    const selection = new vscode.Selection(1, 0, 3, 0)
    assert.strictEqual(formatLineNumber(selection), "#2-3")
  })
})
