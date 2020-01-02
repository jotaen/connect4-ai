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
      [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,2,2,2,2,0],
        [0,0,1,1,1,1,0],
      ],
      // todo add vertical
      // todo add diagonal
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
})
