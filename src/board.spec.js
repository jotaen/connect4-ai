const {Either} = require("ramda-fantasy")
const assert = require("assert")
const {create, findWins, freeSlots, putIntoSlot} = require("./board")

const assertWins = ({expected, board, winningLength = 4}) => {
  const winners = findWins(winningLength, board).map(fs => fs[0].value)
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

    it("creates distinct arrays (not references)", () => {
      const board = create(6, 7)
      assert.notStrictEqual(board[0], board[1])
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

    it("counts the same sequence every time", () => {
      [
        {expected: [3, 3, 3, 3, 3, 3, 3], board: [
          [3,X,X,X,X,X,X],
          [3,X,X,X,X,X,3],
          [3,X,X,2,X,3,2],
          [3,X,X,1,3,2,1],
          [3,X,2,3,2,1,2],
          [3,3,3,3,3,2,1],
        ]},
      ].forEach(assertWins)
    })
  })

  describe("status", () => {
    it("returns free slots", () => {
      [
        {expected: [0, 1, 2, 3, 4, 5, 6], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
        ]},
        {expected: [0, 1, 2, 3, 4, 5, 6], board: [
          [X,X,X,X,X,X,X],
          [2,X,X,X,X,X,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]},
        {expected: [0, 3, 4, 5], board: [
          [X,2,1,X,X,X,2],
          [2,1,1,1,1,2,2],
          [2,2,2,2,2,1,2],
          [2,1,1,1,1,2,1],
          [2,1,2,1,2,2,2],
          [1,1,1,1,2,2,1],
        ]},
        {expected: [], board: [
          [1,2,1,1,1,1,1],
          [2,1,1,1,1,2,2],
          [2,2,2,2,2,1,2],
          [2,1,1,1,1,2,1],
          [2,1,2,1,2,2,2],
          [1,1,1,1,2,2,1],
        ]},
      ].forEach(({expected, board}) => {
        const result = freeSlots(board)
        assert.deepStrictEqual(result, expected)
      })
    })

    it("puts value into slot (if possible) and returns new board", () => {
      [
        {slot: 3, value: 1, expected: {row: 5, slot: 3, value: 1}, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
        ]},
        {slot: 4, value: 3, expected: {row: 2, slot: 4, value: 3}, board: [
          [1,X,X,X,X,1,X],
          [2,X,X,X,X,2,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]},
        {slot: 0, value: 1, expected: "SLOT_IS_FULL", board: [
          [1,X,X,X,X,1,X],
          [2,X,X,X,X,2,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]},
      ].forEach(({slot, value, expected, board}) => {
        const result = putIntoSlot(value, slot, board)
        result.either(error => {
          assert.strictEqual(error, expected)
        }, newBoard => {
          assert.strictEqual(newBoard[expected.row][expected.slot], expected.value)
        })
      })
    })

    it("creates a fresh board when putting something", () => {
      const board = [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
      ]
      const newBoard = putIntoSlot(true, 1, board).value
      // old board is not affected by new board’s changes:
      assert.strictEqual(board[0][1], X)

      // new board is not affected by old board’s changes:
      board[4][4] = false
      assert.strictEqual(newBoard[4][4], X)
    })
  })

  describe("parametrisation", () => {
    it("can handle arbitrary winning lengths", () => {
      [
        {winningLength: 7, expected: [1], board: [
          [2,X,X,X,X,X,X],
          [2,X,X,X,X,X,1],
          [2,X,X,X,X,1,2],
          [2,X,X,X,1,2,2],
          [2,X,X,1,2,2,2],
          [1,1,1,1,1,1,1],
        ]},
        {winningLength: 2, expected: [1, 1, 1, 2, 2, 2], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,1,2,X,X],
          [1,2,1,1,2,2,X],
        ]}
      ].forEach(assertWins)
    })

    it("can handle arbitrary number of player ids", () => {
      [
        {expected: [3], board: [
          [3,X,X,X,X,X,X],
          [3,X,X,X,X,X,1],
          [2,X,X,X,X,1,2],
          [2,X,X,X,3,3,3],
          [2,X,X,1,2,2,2],
          [1,3,3,3,3,1,1],
        ]},
        {expected: [1], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,1,X,X,X],
          [1,1,1,1,X,X,X],
        ]}
      ].forEach(assertWins)
    })

    it("can handle arbitrary board size", () => {
      [
        {expected: [1], board: [
          [X,X,X,X],
          [1,1,1,1],
        ]},
        {expected: [1], board: [
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,X,X,X],
          [X,X,X,X,2,2,2,1,X,X,X,X,X,X],
          [X,X,X,X,2,1,1,2,X,X,X,X,X,X],
          [X,X,X,X,2,1,1,1,2,1,X,X,X,X],
        ]}
      ].forEach(assertWins)
    })

    it("can handle arbitrary winning positions", () => {
      [
        {expected: [1], board: [
          [1,1,1,1],
          [X,X,X,X],
        ]},
        {expected: [1, 2, 3], board: [
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X,3,X,X,X,X,X,X],
          [2,X,X,X,X,X,X,X,3,X,X,X,X,X],
          [2,X,X,X,X,X,X,X,X,3,X,X,X,X],
          [2,X,X,X,X,X,X,X,X,X,3,X,X,X],
          [2,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,X,X,X],
          [X,X,X,X,2,2,2,1,1,1,1,X,X,X],
          [X,X,X,X,2,1,1,2,X,X,X,X,X,X],
          [X,X,X,X,2,1,1,1,2,1,X,X,X,X],
        ]}
      ].forEach(assertWins)
    })
  })
})
