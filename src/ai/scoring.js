const R = require("ramda")
const F = require("../lib/F")
const { isWin, hasFreeSlots } = require("../board")
const { SCORE } = require("./datastructures")

// :: (((Board, [Number]) -> Number), Config, Node) -> Number
const score = (config, node) => {
  if (isWin(config.winningLength, node.board, node.field)) {
    const value = node.isMax ? SCORE.WIN : SCORE.LOST
    return value / (node.depth + 1)
  }
  if (!hasFreeSlots(node.board)) {
    return SCORE.DRAW
  }
  return SCORE.UNKNOWN
}

const maximise = (a, b) => {
  if (a.score === SCORE.UNKNOWN && b.score === SCORE.UNKNOWN) {

  }
  return F.maxBy(R.prop("score"))(a, b)
}

// :: [NodeResult] -> NodeResult
const findSuccessor = R.reduce((prev, curr) => {
  if (!prev) {
    return curr
  }
  const decide = curr.isMax ? maximise : F.minBy(R.prop("score"))
  return decide(curr, prev)
}, undefined)

module.exports = {
  score,
  findSuccessor,
}
