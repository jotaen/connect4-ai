const assert = require("assert")
const R = require("ramda")
const { deepening } = require("./deepening")
const { SCORE, NodeResult } = require("./datastructures")

const deepenFn = (iterationCount, iterationBudget, scores) => {
  const stats = { iterationCount }
  const evalFn = () => () => {
    stats.iterationCount++
    return { score: scores.shift() }
  }
  const config = Object.freeze({ iterationBudget })
  return deepening(evalFn)(config, stats, null, null, 5, null)
}

describe("Deepening", () => {
  it("deepens evaluation when there is no `WIN` and when there are `UNKNOWN`s", () => {
    const before = [
      NodeResult(0, SCORE.LOST),
      NodeResult(1, SCORE.UNKNOWN),
      NodeResult(2, SCORE.DRAW)
    ]
    const after = deepenFn(1, 5, [SCORE.WIN])(before)
    assert.deepStrictEqual(after.map(s => s.score), [
      SCORE.LOST,
      SCORE.WIN,
      SCORE.DRAW,
    ])
  })

  it("doesn’t deepen when there is a win", () => {
    const before = [
      NodeResult(0, SCORE.LOST),
      NodeResult(1, SCORE.WIN),
      NodeResult(2, SCORE.DRAW),
      NodeResult(3, SCORE.UNKNOWN),
    ]
    const after = deepenFn(1, 5, [])(before)
    assert.deepStrictEqual(after.map(s => s.score), [
      SCORE.LOST,
      SCORE.WIN,
      SCORE.DRAW,
      SCORE.UNKNOWN,
    ])
  })

  it("continues until is finds a `WIN`", () => {
    const before = [
      NodeResult(0, SCORE.DRAW),
      NodeResult(1, SCORE.UNKNOWN),
      NodeResult(2, SCORE.UNKNOWN),
    ]
    const after = deepenFn(1, 100, [SCORE.UNKNOWN, SCORE.UNKNOWN, SCORE.WIN])(before)
    assert.deepStrictEqual(after.map(s => s.score), [
      SCORE.DRAW,
      SCORE.WIN,
      SCORE.UNKNOWN,
    ])
  })

  it("continues until iteration budget is exceeded", () => {
    const before = [
      NodeResult(0, SCORE.DRAW),
      NodeResult(1, SCORE.UNKNOWN),
      NodeResult(2, SCORE.UNKNOWN),
    ]
    const after = deepenFn(1, 3, [SCORE.UNKNOWN, SCORE.UNKNOWN, SCORE.UNKNOWN, SCORE.WIN])(before)
    assert.deepStrictEqual(after.map(s => s.score), [
      SCORE.DRAW,
      SCORE.UNKNOWN,
      SCORE.UNKNOWN,
    ])
  })
})
