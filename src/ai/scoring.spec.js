const assert = require("assert")
const { score, findSuccessor } = require("./scoring")
const { SCORE, NodeResult } = require("./datastructures")
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

  describe("findSuccessor", () => {
    it("picks the highest scored node for Max", () => {
      const nr1 = NodeResult(1, SCORE.UNKNOWN, true)
      const nr2 = NodeResult(2, SCORE.WIN, true)
      const nr3 = NodeResult(3, SCORE.DRAW, true)
      const nr4 = NodeResult(4, SCORE.LOST, true)
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.deepStrictEqual(res, nr2)
    })

    it("picks the highest scored node for Min", () => {
      const nr1 = NodeResult(1, SCORE.UNKNOWN, false)
      const nr2 = NodeResult(2, SCORE.WIN, false)
      const nr3 = NodeResult(3, SCORE.DRAW, false)
      const nr4 = NodeResult(4, SCORE.LOST, false)
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.deepStrictEqual(res, nr4)
    })

    it("favours `DRAW` over `UNKNOWN` for Max", () => {
      const nr1 = NodeResult(2, SCORE.UNKNOWN, true)
      const nr2 = NodeResult(3, SCORE.DRAW, true)
      const nr3 = NodeResult(4, SCORE.UNKNOWN, true)
      const nr4 = NodeResult(5, SCORE.LOST, true)
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.deepStrictEqual(res, nr2)
    })

    it("favours `DRAW` over `UNKNOWN` for Min", () => {
      const nr1 = NodeResult(1, SCORE.WIN, false)
      const nr2 = NodeResult(2, SCORE.UNKNOWN, false)
      const nr3 = NodeResult(3, SCORE.UNKNOWN, false)
      const nr4 = NodeResult(4, SCORE.DRAW, false)
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.deepStrictEqual(res, nr4)
    })

    it("picks the first of `UNKNOWN`s for Max", () => {
      const nr1 = NodeResult(1, SCORE.UNKNOWN, true)
      const nr2 = NodeResult(2, SCORE.LOST, true)
      const nr3 = NodeResult(3, SCORE.UNKNOWN, true)
      const nr4 = NodeResult(4, SCORE.UNKNOWN, true)
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.deepStrictEqual(res, nr1)
    })

    it("picks the first of `UNKNOWN`s for Min", () => {
      const nr1 = NodeResult(1, SCORE.WIN, false)
      const nr2 = NodeResult(2, SCORE.WIN, false)
      const nr3 = NodeResult(3, SCORE.UNKNOWN, false)
      const nr4 = NodeResult(4, SCORE.UNKNOWN, false)
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.deepStrictEqual(res, nr3)
    })

    it("picks the highest chance of `UNKNOWN`s for Max", () => {
      const nr1 = NodeResult(1, SCORE.UNKNOWN, true)
      nr1.chance = 2
      const nr2 = NodeResult(2, SCORE.UNKNOWN, true)
      nr2.chance = 5
      const nr3 = NodeResult(3, SCORE.UNKNOWN, true)
      nr3.chance = 3
      const nr4 = NodeResult(4, SCORE.UNKNOWN, true)
      nr4.chance = 1
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.deepStrictEqual(res, nr2)
    })

    it("culmulates possible wins as chance", () => {
      const nr1 = NodeResult(1, 0.1, false)
      const nr2 = NodeResult(2, SCORE.UNKNOWN, false)
      const nr3 = NodeResult(3, 1, false)
      const nr4 = NodeResult(3, 0.5, false)
      const nr5 = NodeResult(4, SCORE.UNKNOWN, false)
      const res = findSuccessor([nr1, nr2, nr3, nr4, nr5])
      assert.strictEqual(res.chance, 13)
    })

    it("if there is no win, it cuts chance in half", () => {
      const nr1 = NodeResult(1, SCORE.UNKNOWN, true)
      nr1.chance = 2
      const nr2 = NodeResult(2, SCORE.UNKNOWN, true)
      nr2.chance = 5
      const nr3 = NodeResult(3, SCORE.UNKNOWN, true)
      nr3.chance = 3
      const nr4 = NodeResult(4, SCORE.UNKNOWN, true)
      nr4.chance = 1
      const res = findSuccessor([nr1, nr2, nr3, nr4])
      assert.strictEqual(res.chance, 2.75)
    })
  })
})
