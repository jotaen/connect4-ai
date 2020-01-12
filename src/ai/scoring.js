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

const compare = fn => (a, b) => (() => {
  if (a.score === 0 && b.score === null) return a
  if (a.score === null && b.score === 0) return b
  return (fn(a.score, b.score)) ? a : b
})()

// :: [NodeResult] -> NodeResult
const findSuccessor = R.reduce((prev, curr) => {
  if (!prev) {
    return curr
  }
  const decide = compare(curr.isMax ? R.gt : R.lt)
  return decide(curr, prev)
}, undefined)

module.exports = {
  score,
  findSuccessor,
}
