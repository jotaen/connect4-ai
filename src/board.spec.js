const assert = require("assert")
const {create, Field, findWin, isWin, freeSlots, hasFreeSlots, putIntoSlot} = require("./board")
const Fd = Field

const assertWins = ({expected, board, winningLength = 4}) => {
  const isWon = isWin(winningLength, board, expected.lastPlacement)
  const winners = findWin(winningLength, board)
  if (expected.winFields === null) {
    assert.strictEqual(winners, null)
    assert.strictEqual(isWon, false)
  } else {
    assert.deepStrictEqual(winners.sort(), expected.winFields.sort())
    assert.strictEqual(isWon, true)
  }
}

const X = null

describe("Board", () => {
  describe("initialisation", () => {
    it("initialises board with given dimensions", () => {
      const rows = 6
      const slots = 7
      const board = create(rows, slots)
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
        {expected: {
          winFields: null,
          lastPlacement: Field(2,0,1),
         }, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [1,X,X,2,X,X,X],
          [2,X,1,1,X,X,X],
          [2,1,2,1,X,X,X],
          [1,2,1,2,X,X,X],
        ]},
        {expected: {
          winFields: null,
          lastPlacement: Field(0,2,1),
         }, board: [
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
        {expected: {
          winFields: [Fd(5,2,1), Fd(5,3,1), Fd(5,4,1), Fd(5,5,1)],
          lastPlacement: Fd(5,3,1),
         }, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,1,1,1,1,X],
        ]},
        {expected: {
          winFields: [Fd(2,3,2), Fd(2,4,2), Fd(2,5,2), Fd(2,6,2)],
          lastPlacement: Fd(2,4,2),
         }, board: [
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
        {expected: {
          winFields: [Fd(2,2,1), Fd(3,2,1), Fd(4,2,1), Fd(5,2,1)],
          lastPlacement: Fd(2,2,1),
         }, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
          [X,X,1,X,X,X,X],
        ]},
        {expected: {
          winFields: [Fd(1,4,2), Fd(2,4,2), Fd(3,4,2), Fd(4,4,2)],
          lastPlacement: Fd(1,4,2),
         }, board: [
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
        {expected: {
          winFields: [Fd(2,0,1), Fd(3,1,1), Fd(4,2,1), Fd(5,3,1)],
          lastPlacement: Fd(4,2,1),
         }, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [1,X,X,X,X,X,X],
          [2,1,X,X,X,X,X],
          [2,2,1,X,X,X,X],
          [2,2,2,1,X,X,X],
        ]},
        {expected: {
          winFields: [Fd(0,3,1), Fd(1,4,1), Fd(2,5,1), Fd(3,6,1)],
          lastPlacement: Fd(0,3,1),
         }, board: [
          [X,X,X,1,X,X,X],
          [X,X,X,2,1,X,X],
          [X,X,X,1,1,1,X],
          [X,X,X,2,2,1,1],
          [X,X,X,1,2,1,2],
          [X,X,X,2,1,2,2],
        ]},
        {expected: {
          winFields: [Fd(5,2,2), Fd(4,3,2), Fd(3,4,2), Fd(2,5,2)],
          lastPlacement: Fd(2,5,2),
         }, board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,1,X,X],
          [X,X,2,X,2,2,X],
          [X,X,1,X,2,1,X],
          [X,X,1,2,2,2,1],
          [X,X,2,2,1,1,2],
        ]},
        {expected: {
          winFields: [Fd(3,0,2), Fd(2,1,2), Fd(1,2,2), Fd(0,3,2)],
          lastPlacement: Fd(2,1,2),
         }, board: [
          [X,X,X,2,X,X,X],
          [X,X,2,1,X,X,X],
          [1,2,1,2,X,X,X],
          [2,2,2,1,X,X,X],
          [2,1,1,2,X,X,X],
          [2,2,2,1,X,X,X],
        ]},
      ].forEach(assertWins)
    })
  })

  describe("parametrisation", () => {
    it("can handle arbitrary winning lengths", () => {
      [
        {winningLength: 7, expected: {
          winFields: [Fd(5,0,1), Fd(5,1,1), Fd(5,2,1), Fd(5,3,1), Fd(5,4,1), Fd(5,5,1), Fd(5,6,1)],
          lastPlacement: Fd(5,0,1),
       }, board: [
          [2,X,X,X,X,X,X],
          [2,X,X,X,X,X,1],
          [2,X,X,X,X,1,2],
          [2,X,X,X,1,2,2],
          [2,X,X,1,2,2,2],
          [1,1,1,1,1,1,1],
        ]},
        {winningLength: 3, expected: {
          winFields: [Fd(5,2,1), Fd(4,3,1), Fd(3,4,1)],
          lastPlacement: Fd(4,3,1),
       }, board: [
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
        {expected: {
          winFields: [Fd(4,3,3), Fd(3,4,3), Fd(2,5,3), Fd(1,6,3)],
          lastPlacement: Fd(2,5,3),
         }, board: [
          [3,X,X,X,X,X,X],
          [3,X,X,X,X,X,3],
          [2,X,X,X,X,3,2],
          [2,X,X,X,3,1,3],
          [2,X,X,3,2,1,2],
          [1,3,2,3,3,1,1],
        ]},
        {expected: {
          winFields: [Fd(5,0,1), Fd(5,1,1), Fd(5,2,1), Fd(5,3,1)],
          lastPlacement: Fd(5,0,1),
         }, board: [
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
        {expected: {
          winFields: [Fd(1,0,1), Fd(1,1,1), Fd(1,2,1), Fd(1,3,1)],
          lastPlacement: Fd(1,3,1),
         }, board: [
          [X,X,X,X],
          [1,1,1,1],
        ]},
        {expected: {
          winFields: [Fd(5,11,1), Fd(6,11,1), Fd(7,11,1), Fd(8,11,1)],
          lastPlacement: Fd(5,11,1),
         }, board: [
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
        {expected: {
          winFields: [Fd(0,0,1), Fd(0,1,1), Fd(0,2,1), Fd(0,3,1)],
          lastPlacement: Fd(0,2,1),
         }, board: [
          [1,1,1,1],
          [X,X,X,X],
        ]},
        {expected: {
          winFields: [Fd(1,7,3), Fd(2,8,3), Fd(3,9,3), Fd(4,10,3)],
          lastPlacement: Fd(2,8,3),
         }, board: [
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

  describe("status", () => {
    it("returns free slots", () => {
      [
        {expected: {slots: [0, 1, 2, 3, 4, 5, 6], hasSlots: true},
         board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
        ]},
        {expected: {slots: [0, 1, 2, 3, 4, 5, 6], hasSlots: true},
         board: [
          [X,X,X,X,X,X,X],
          [2,X,X,X,X,X,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]},
        {expected: {slots: [0, 3, 4, 5], hasSlots: true},
         board: [
          [X,2,1,X,X,X,2],
          [2,1,1,1,1,2,2],
          [2,2,2,2,2,1,2],
          [2,1,1,1,1,2,1],
          [2,1,2,1,2,2,2],
          [1,1,1,1,2,2,1],
        ]},
        {expected: {slots: [3], hasSlots: true},
         board: [
          [1,2,1,X,2,1,2],
          [2,1,1,1,1,2,2],
          [2,2,2,2,2,1,2],
          [2,1,1,1,1,2,1],
          [2,1,2,1,2,2,2],
          [1,1,1,1,2,2,1],
        ]},
        {expected: {slots: [], hasSlots: false},
         board: [
          [1,2,1,1,1,1,1],
          [2,1,1,1,1,2,2],
          [2,2,2,2,2,1,2],
          [2,1,1,1,1,2,1],
          [2,1,2,1,2,2,2],
          [1,1,1,1,2,2,1],
        ]},
      ].forEach(({expected, board}) => {
        const slots = freeSlots(board)
        assert.deepStrictEqual(slots, expected.slots)
        const hasSlots = hasFreeSlots(board)
        assert.deepStrictEqual(hasSlots, expected.hasSlots)
      })
    })

    it("puts value into slot (if possible) and returns new board", () => {
      [
        {slot: 3, value: 1, expected: Fd(5,3,1), board: [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
        ]},
        {slot: 4, value: 3, expected: Fd(2,4,3), board: [
          [1,X,X,X,X,1,X],
          [2,X,X,X,X,2,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]},
        {slot: 0, value: 1, expected: null, board: [
          [1,X,X,X,X,1,X],
          [2,X,X,X,X,2,X],
          [2,X,X,X,X,1,X],
          [2,X,X,X,1,2,X],
          [2,X,X,1,2,2,X],
          [1,1,1,1,2,2,X],
        ]},
      ].forEach(({slot, value, expected, board}) => {
        const result = putIntoSlot(value, slot, board)
        if (expected === null) {
          assert.strictEqual(result, expected)
        } else {
          assert.strictEqual(result.board[expected.row][expected.slot], expected.value)
          assert.deepStrictEqual(result.field, expected)
        }
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
      const newBoard = putIntoSlot(true, 1, board).board

      // old board is not affected by new board’s changes:
      assert.strictEqual(board[0][1], X)

      // new board is not affected by old board’s changes:
      board[4][4] = false
      assert.strictEqual(newBoard[4][4], X)
    })
  })
})
