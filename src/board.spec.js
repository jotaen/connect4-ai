const assert = require("assert")
const {hasWon} = require("./board")

describe("Board", () => {
  it("is not won when empty", () => {
    const board = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ]
    assert.strictEqual(hasWon(board), null)
  })

  it("is not won when there are not 4 equal pieces in a row", () => {
    const board = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [1,0,0,2,0,0,0],
      [2,0,1,1,0,0,0],
      [2,1,2,1,0,0,0],
      [1,2,1,2,0,0,0],
    ]
    assert.strictEqual(hasWon(board), null)
  })

  it("is won when there are 4 pieces in a row horizontally", () => {
    const board = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,1,1,1,1,0],
    ]
    assert.strictEqual(hasWon(board), 1)
  })

  it("throws if there are two winners present (illegal state)", () => {
    const board = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,2,2,2,2,0],
      [0,0,1,1,1,1,0],
    ]
    assert.throws(() => hasWon(board))
  })
})
