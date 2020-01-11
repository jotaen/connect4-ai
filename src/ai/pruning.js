const R = require("ramda")
const { SCORE, NodeResult } = require("./datastructures")

// :: (Node -> NodeResult) -> [Node] -> [NodeResult]
const mapWithPruning = evaluateFn => R.compose(
  R.tail,
  R.scan((prev, curr) => {
    const shouldCutOff = (prev && (
      (curr.isMax && prev.score > SCORE.DRAW)
      || (!curr.isMax && prev.score === SCORE.LOST) // only prune when loss is “close”
      ))
    if (shouldCutOff) {
      return NodeResult(curr.field.slot, SCORE.UNKNOWN, curr.isMax)
    }
    return evaluateFn(curr)
}, undefined))

module.exports = {
  mapWithPruning
}
