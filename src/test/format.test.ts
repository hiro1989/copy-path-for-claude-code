import assert from "node:assert"

import vscode from "vscode"

import { formatLineNumber, formatLineSuffix, sortPaths } from "../format"

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

suite("formatLineSuffix", () => {
  test("empty selection returns empty string", () => {
    const selection = new vscode.Selection(2, 0, 2, 0)
    assert.strictEqual(formatLineSuffix(selection), "")
  })

  test("single line selection returns #line", () => {
    const selection = new vscode.Selection(2, 0, 2, 5)
    assert.strictEqual(formatLineSuffix(selection), "#3")
  })

  test("multi-line selection returns #start-end", () => {
    const selection = new vscode.Selection(1, 0, 3, 5)
    assert.strictEqual(formatLineSuffix(selection), "#2-4")
  })

  test("column-0 edge case adjusts end line back by one", () => {
    const selection = new vscode.Selection(1, 0, 3, 0)
    assert.strictEqual(formatLineSuffix(selection), "#2-3")
  })
})

suite("sortPaths", () => {
  test("sorts paths alphabetically", () => {
    const input = ["@cspell.json", "@.oxfmtrc.json", "@.tool-versions"]
    assert.deepStrictEqual(sortPaths(input), ["@.oxfmtrc.json", "@.tool-versions", "@cspell.json"])
  })

  test("sorts line numbers numerically, not lexicographically", () => {
    const input = ["@src/app.ts#126", "@src/app.ts#9", "@src/app.ts#13"]
    assert.deepStrictEqual(sortPaths(input), ["@src/app.ts#9", "@src/app.ts#13", "@src/app.ts#126"])
  })

  test("sorts by start line then end line numerically", () => {
    const input = [
      "@src/test/format.test.ts#20-23",
      "@src/test/format.test.ts#13-14",
      "@src/test/format.test.ts#126-129",
      "@src/test/format.test.ts#126-127",
    ]
    assert.deepStrictEqual(sortPaths(input), [
      "@src/test/format.test.ts#13-14",
      "@src/test/format.test.ts#20-23",
      "@src/test/format.test.ts#126-127",
      "@src/test/format.test.ts#126-129",
    ])
  })

  test("single-item array returns unchanged", () => {
    const input = ["@src/app.ts#5"]
    assert.deepStrictEqual(sortPaths(input), ["@src/app.ts#5"])
  })

  test("empty array returns empty array", () => {
    assert.deepStrictEqual(sortPaths([]), [])
  })
})
