const assert = require("assert")
const R = require("ramda")
const { mapWithPruning } = require("./pruning")
const { SCORE } = require("./datastructures")

const Nd = (isMax, depth, maxDepth, score) => ({
  isMax, depth, maxDepth, score, field: {slot: 1763}
})

describe("Pruning", () => {
  it("cuts off the remainder if `WIN` is found for Max", () => {
    const nodes = [
      Nd(true, 2, 3, SCORE.LOST), Nd(true, 2, 3, SCORE.WIN), Nd(true, 2, 3, SCORE.WIN)
    ]
    const scores = mapWithPruning(R.identity)(nodes).map(n => n.score)
    assert.deepStrictEqual(scores, [SCORE.LOST, SCORE.WIN, SCORE.UNKNOWN])
  })

  it("configures cut-off results properly", () => {
    const nodes = [
      Nd(true, 2, 3, SCORE.LOST), Nd(true, 2, 3, SCORE.WIN), Nd(true, 2, 3, SCORE.WIN)
    ]
    const scores = mapWithPruning(R.identity)(nodes)[2]
    assert.deepStrictEqual(scores, {
      slot: 1763,
      depth: 2,
      isMax: true,
      score: SCORE.UNKNOWN,
      chance: undefined,
    })
  })

  it("reconfigures max depth if `LOST` is found for Min", () => {
    const nodes = [
      Nd(false, 5, 10, SCORE.WIN), Nd(false, 5, 10, SCORE.LOST), Nd(false, 5, 10, SCORE.LOST)
    ]
    const scores = mapWithPruning(R.identity)(nodes).map(n => n.score)
    assert.deepStrictEqual(scores, [SCORE.WIN, SCORE.LOST, SCORE.LOST])
    assert.strictEqual(nodes[0].maxDepth, 10)
    assert.strictEqual(nodes[1].maxDepth, 10)
    assert.strictEqual(nodes[2].maxDepth, 4)
  })
})
