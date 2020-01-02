const assert = require("assert")
const {create, findWins, isFilledUp} = require("./board")

const assertWins = ({expected, board}) => {
  const winners = findWins(4, board)
  assert.deepStrictEqual(winners.sort(), expected.sort())
}

const X = null

describe("Board", () => {
  describe("initialisation", () => {
    it("initialises board with given dimensions", () => {
      const rows = 6
      const columns = 7
      const board = create(rows, columns)
      assert.strictEqual(board.length, rows)
      board.forEach(r => r.forEach(f => {
        assert.strictEqual(f, null)
      }))
    })
  })

  describe("winning", () => {
    it("finds no winner when board is completely empty", () => {
      const board = [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
      ]
      assert.strictEqual(findWins(4, board).length, 0)
    })

    it("finds no winner when there is no winning sequence", () => {
      [
        {expected: [], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [1,X,X,2,X,X,X],
          [2,X,1,1,X,X,X],
          [2,1,2,1,X,X,X],
          [1,2,1,2,X,X,X],
        ]},
        {expected: [], board: [
          [X,1,X,X,X,X,X],
          [X,2,X,X,X,X,X],
          [1,1,X,X,X,X,X],
          [2,2,2,1,X,1,2],
          [2,2,2,1,1,1,2],
          [2,2,2,1,1,1,2],
        ]},
      ].forEach(assertWins)
    })

    it("finds winners in horizontal sequences", () => {
      [
        {expected: [1], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,1,1,1,1,X],
        ]},
        {expected: [2], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,2,2,2,2],
          [X,X,X,1,1,1,2],
          [X,X,X,1,2,2,1],
          [X,X,2,1,1,1,2],
        ]},
        {expected: [2, 1], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,2,2,2,2,X],
          [X,X,1,1,1,1,X],
        ]},
      ].forEach(assertWins)
    })

    it("finds winners in vertical sequences", () => {
      [
        {expected: [1], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
        ]},
        {expected: [2], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,2,X,X],
          [X,X,1,X,2,X,X],
          [X,X,1,X,2,X,X],
          [X,X,1,2,2,2,1],
          [X,X,2,2,1,1,2],
        ]},
        {expected: [1, 2], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,1,X,X,X,2],
          [X,X,1,X,X,X,2],
          [X,X,1,X,X,X,2],
          [X,X,1,X,X,X,2],
        ]},
      ].forEach(assertWins)
    })

    it("finds winners in diagonal sequences", () => {
      [
        {expected: [1], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [1,X,X,X,X,X,X],
          [2,1,X,X,X,X,X],
          [2,2,1,X,X,X,X],
          [2,2,2,1,X,X,X],
        ]},
        {expected: [2], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,1,X,X],
          [X,X,2,X,2,2,X],
          [X,X,1,X,2,1,X],
          [X,X,1,2,2,2,1],
          [X,X,2,2,1,1,2],
        ]},
        {expected: [1, 2], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [1,X,X,X,X,2,X],
          [2,1,X,X,2,1,X],
          [2,2,1,2,1,1,X],
          [2,2,2,1,1,1,X],
        ]},
      ].forEach(assertWins)
    })

    it("finds all winners in all directions", () => {
      [
        {expected: [1, 2, 1], board: [
          [X,X,X,X,X,X,X],
          [2,X,X,X,X,X,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]}
      ].forEach(assertWins)
    })
  })

  describe("status", () => {
    it("states whether there are empty fields left", () => {
      [
        {expected: false, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
        ]},
        {expected: false, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,1],
        ]},
        {expected: false, board: [
          [X,X,X,X,X,X,X],
          [2,X,X,X,X,X,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]},
        {expected: false, board: [
          [X,2,1,1,1,1,2],
          [2,1,1,1,1,2,2],
          [2,2,2,2,2,1,2],
          [2,1,1,1,1,2,1],
          [2,1,2,1,2,2,2],
          [1,1,1,1,2,2,1],
        ]},
        {expected: true, board: [
          [1,2,1,1,1,1,1],
          [2,1,1,1,1,2,2],
          [2,2,2,2,2,1,2],
          [2,1,1,1,1,2,1],
          [2,1,2,1,2,2,2],
          [1,1,1,1,2,2,1],
        ]},
      ].forEach(({expected, board}) => {
        const result = isFilledUp(board)
        assert.strictEqual(result, expected)
      })
    })
  })
})
