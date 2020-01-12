const assert = require("assert")
const { score } = require("./scoring")
const { SCORE } = require("./datastructures")
const Fd = require("../board").Field

const Node = (board, field, isMax, itDepth) => ({
  board: board,
  field: field,
  isMax: isMax,
  depth: itDepth,
})

const _ = null
const a = 1

const cfg = () => ({
  winningLength: 3,
  players: [a, 0]
})

describe("Scoring", () => {
  describe("score", () => {
    it("scores `WIN` when node is won", () => {
      const n = Node([
        [_,_,a],
        [_,a,0],
        [a,0,a],
      ], Fd(2, 0, a), true, 0)
      const s = score(cfg(), n)
      assert.strictEqual(s, SCORE.WIN)
    })

    it("scores `LOST` when node is lost", () => {
      const n = Node([
        [_,_,0],
        [_,a,0],
        [_,0,0],
      ], Fd(0, 2, 1), false, 0)
      const s = score(cfg(), n)
      assert.strictEqual(s, SCORE.LOST)
    })

    it("scores `DRAW` when node is neither won nor lost", () => {
      const n = Node([
        [0,0,a],
        [0,a,0],
        [a,0,a],
      ], Fd(0, 1, 1), true, 0)
      const s = score(cfg(), n)
      assert.strictEqual(s, SCORE.DRAW)
    })

    it("scores `UNKNOWN` in all other cases", () => {
      const n = Node([
        [_,0,a],
        [0,a,0],
        [a,0,a],
      ], Fd(0, 1, 1), true, 0)
      const s = score(cfg(), n)
      assert.strictEqual(s, SCORE.UNKNOWN)
    })

    it("factors in iteration depth for `WIN`/`LOST`", () => {
      const n1 = Node([
        [_,_,a],
        [_,a,0],
        [a,0,a],
      ], Fd(2, 0, a), true, 2)
      const s1 = score(cfg(), n1)
      assert.strictEqual(s1, SCORE.WIN / 3)

      const n2 = Node([
        [_,_,0],
        [_,a,0],
        [_,0,0],
      ], Fd(0, 2, 1), false, 5)
      const s2 = score(cfg(), n2)
      assert.strictEqual(s2, SCORE.LOST / 6)
    })
  })
})
