const R = require("ramda")
const F = require("../lib/F")
const { isWin, freeSlots } = require("../board")
const { SCORE } = require("./datastructures")

// :: (((Board, [Number]) -> Number), Config, Node) -> Number
const score = (next, config, node) => {
  if (isWin(config.winningLength, node.board, node.field)) {
    const value = node.isMax ? SCORE.WIN : SCORE.LOST
    return value / (node.depth + 1)
  }
  const nextSlots = freeSlots(node.board)
  if (nextSlots.length === 0) {
    return SCORE.DRAW
  }
  if (node.isIterationLimit) {
    return SCORE.UNKNOWN
  }
  return next(node.board, nextSlots)
}

// :: [NodeResult] -> NodeResult
const findSuccessor = R.reduce((prev, curr) => {
  const decide = curr.isMax ? F.maxBy(R.prop("score")) : F.minBy(R.prop("score"))
  return !prev ? curr : decide(curr, prev)
}, undefined)

module.exports = {
  score,
  findSuccessor,
}
