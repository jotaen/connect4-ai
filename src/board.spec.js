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

  it("is not won when there is no winning sequence", () => {
    [
      [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [1,0,0,2,0,0,0],
        [2,0,1,1,0,0,0],
        [2,1,2,1,0,0,0],
        [1,2,1,2,0,0,0],
      ],
      [
        [0,1,0,0,0,0,0],
        [0,2,0,0,0,0,0],
        [1,1,0,0,0,0,0],
        [2,2,2,1,0,1,2],
        [2,2,2,1,1,1,2],
        [2,2,2,1,1,1,2],
      ],
    ].forEach(board => {
      assert.strictEqual(hasWon(board), null)
    })
  })

  it("throws if there are two winners present (illegal state)", () => {
    [
      [ // Horizontal
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,2,2,2,2,0],
        [0,0,1,1,1,1,0],
      ],
      [ // Vertical
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,1,0,0,0,2],
        [0,0,1,0,0,0,2],
        [0,0,1,0,0,0,2],
        [0,0,1,0,0,0,2],
      ],
      [ // Diagonal
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [1,0,0,0,0,2,0],
        [2,1,0,0,2,1,0],
        [2,2,1,2,1,1,0],
        [2,2,2,1,1,1,0],
      ],
      [ // All
        [0,0,0,0,0,0,0],
        [2,0,0,0,0,0,0],
        [2,0,0,0,0,1,0],
        [2,0,0,0,1,2,0],
        [2,0,0,1,2,2,0],
        [1,1,1,1,2,2,0],
      ],
    ].forEach(board => {
      assert.throws(() => hasWon(board))
    })
  })

  it("is won there is a horizontal winning sequence", () => {
    const board1 = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,1,1,1,1,0],
    ]
    assert.strictEqual(hasWon(board1), 1)
    const board2 = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,2,2,2,2],
      [0,0,0,1,1,1,2],
      [0,0,0,1,2,2,1],
      [0,0,2,1,1,1,2],
    ]
    assert.strictEqual(hasWon(board2), 2)
  })

  it("is won there is a vertical winning sequence", () => {
    const board1 = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0],
      [0,0,1,0,0,0,0],
      [0,0,1,0,0,0,0],
      [0,0,1,0,0,0,0],
    ]
    assert.strictEqual(hasWon(board1), 1)
    const board2 = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,2,0,0],
      [0,0,1,0,2,0,0],
      [0,0,1,0,2,0,0],
      [0,0,1,2,2,2,1],
      [0,0,2,2,1,1,2],
    ]
    assert.strictEqual(hasWon(board2), 2)
  })

  it("is won there is a diagonal winning sequence (in either direction)", () => {
    const board1 = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0],
      [2,1,0,0,0,0,0],
      [2,2,1,0,0,0,0],
      [2,2,2,1,0,0,0],
    ]
    assert.strictEqual(hasWon(board1), 1)
    const board2 = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0],
      [0,0,2,0,2,2,0],
      [0,0,1,0,2,1,0],
      [0,0,1,2,2,2,1],
      [0,0,2,2,1,1,2],
    ]
    assert.strictEqual(hasWon(board2), 2)
  })
})
