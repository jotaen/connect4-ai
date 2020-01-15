const R = require("ramda")
const { SCORE, NodeResult } = require("./datastructures")

// :: (Node -> NodeResult) -> [Node] -> [NodeResult]
const mapWithPruning = evaluateFn => R.compose(
  R.tail,
  R.scan((prevNodeResult, currNode) => {
    const shouldCutOff = (prevNodeResult && (currNode.isMax && prevNodeResult.score === SCORE.WIN))
    if (shouldCutOff) {
      return NodeResult(currNode.field.slot, SCORE.UNKNOWN, currNode.isMax, undefined, currNode.depth)
    }
    const shouldLimitDepth = (prevNodeResult && (!currNode.isMax && prevNodeResult.score === SCORE.LOST))
    if (shouldLimitDepth) {
      currNode.maxDepth = prevNodeResult.depth - 1
    }
    return evaluateFn(currNode)
}, undefined))

module.exports = {
  mapWithPruning
}
