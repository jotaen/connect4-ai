const {Either} = require("ramda-fantasy")
const assert = require("assert")
const {create, field, findWin, freeSlots, putIntoSlot} = require("./board")

const assertWins = ({expected, board, winningLength = 4}) => {
  const winners = findWin(winningLength, board)
  if (expected === null) {
    assert.strictEqual(winners, null)
  } else {
    assert.deepStrictEqual(winners.sort(), expected.sort())
  }
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
    it("finds no winner when board is completely blank", () => {
      const board = [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
      ]
      assert.strictEqual(findWin(4, board), null)
    })

    it("finds no winner when there is no winning sequence", () => {
      [
        {expected: null, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [1,X,X,2,X,X,X],
          [2,X,1,1,X,X,X],
          [2,1,2,1,X,X,X],
          [1,2,1,2,X,X,X],
        ]},
        {expected: null, board: [
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
        {expected: [field(5,2,1), field(5,3,1), field(5,4,1), field(5,5,1)], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,1,1,1,1,X],
        ]},
        {expected: [field(2,3,2), field(2,4,2), field(2,5,2), field(2,6,2)], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,2,2,2,2],
          [X,X,X,1,1,1,2],
          [X,X,X,1,2,2,1],
          [X,X,2,1,1,1,2],
        ]},
      ].forEach(assertWins)
    })

    it("finds winners in vertical sequences", () => {
      [
        {expected: [field(2,2,1), field(3,2,1), field(4,2,1), field(5,2,1)], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
        ]},
        {expected: [field(1,4,2), field(2,4,2), field(3,4,2), field(4,4,2)], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,2,X,X],
          [X,X,1,X,2,X,X],
          [X,X,1,X,2,X,X],
          [X,X,1,2,2,2,1],
          [X,X,2,2,1,1,2],
        ]},
      ].forEach(assertWins)
    })

    it("finds winners in diagonal sequences", () => {
      [
        {expected: [field(2,0,1), field(3,1,1), field(4,2,1), field(5,3,1)], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [1,X,X,X,X,X,X],
          [2,1,X,X,X,X,X],
          [2,2,1,X,X,X,X],
          [2,2,2,1,X,X,X],
        ]},
        {expected: [field(5,2,2), field(4,3,2), field(3,4,2), field(2,5,2)], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,1,X,X],
          [X,X,2,X,2,2,X],
          [X,X,1,X,2,1,X],
          [X,X,1,2,2,2,1],
          [X,X,2,2,1,1,2],
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
        {slot: 3, value: 1, expected: field(5,3,1), board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
        ]},
        {slot: 4, value: 3, expected: field(2,4,3), board: [
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
        {winningLength: 7, expected: [
          field(5,0,1), field(5,1,1), field(5,2,1), field(5,3,1), field(5,4,1), field(5,5,1), field(5,6,1), 
        ], board: [
          [2,X,X,X,X,X,X],
          [2,X,X,X,X,X,1],
          [2,X,X,X,X,1,2],
          [2,X,X,X,1,2,2],
          [2,X,X,1,2,2,2],
          [1,1,1,1,1,1,1],
        ]},
        {winningLength: 3, expected: [
          field(5,2,1), field(4,3,1), field(3,4,1)
        ], board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,1,X,X],
          [X,X,X,1,2,X,X],
          [1,2,1,1,2,2,X],
        ]}
      ].forEach(assertWins)
    })

    it("can handle arbitrary number of player ids", () => {
      [
        {expected: [field(4,3,3), field(3,4,3), field(2,5,3), field(1,6,3)], board: [
          [3,X,X,X,X,X,X],
          [3,X,X,X,X,X,3],
          [2,X,X,X,X,3,2],
          [2,X,X,X,3,1,3],
          [2,X,X,3,2,1,2],
          [1,3,2,3,3,1,1],
        ]},
        {expected: [field(5,0,1), field(5,1,1), field(5,2,1), field(5,3,1)], board: [
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
        {expected: [field(1,0,1), field(1,1,1), field(1,2,1), field(1,3,1)], board: [
          [X,X,X,X],
          [1,1,1,1],
        ]},
        {expected: [field(5,11,1), field(6,11,1), field(7,11,1), field(8,11,1)], board: [
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,2,X,X,X,X,X,X,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,1,X,X],
          [X,X,X,X,X,1,X,X,X,X,X,1,X,X],
          [X,X,X,X,2,2,2,1,X,X,X,1,X,X],
          [X,X,X,X,2,1,1,2,X,X,1,1,X,X],
          [X,X,X,X,2,1,1,1,2,1,2,2,X,X],
        ]}
      ].forEach(assertWins)
    })

    it("can handle arbitrary (illegal) winning positions", () => {
      [
        {expected: [field(0,0,1), field(0,1,1), field(0,2,1), field(0,3,1)], board: [
          [1,1,1,1],
          [X,X,X,X],
        ]},
        {expected: [field(1,7,3), field(2,8,3), field(3,9,3), field(4,10,3)], board: [
          [X,X,X,X,X,X,X,X,X,X,X,X,X,X],
          [X,X,X,3,X,X,X,3,X,X,X,X,X,X],
          [3,X,X,X,X,X,X,X,3,X,X,X,X,X],
          [2,X,X,X,1,X,X,X,X,3,X,X,X,X],
          [1,X,X,X,X,X,X,X,X,X,3,X,X,2],
          [2,X,X,X,X,X,X,X,X,X,X,X,X,2],
          [X,X,X,X,X,1,X,X,X,X,X,X,X,X],
          [X,X,X,3,2,2,2,1,1,2,1,X,X,X],
          [X,X,X,X,2,1,1,2,X,X,X,X,X,X],
          [X,X,X,X,2,1,1,1,2,1,X,X,X,X],
        ]}
      ].forEach(assertWins)
    })
  })
})
