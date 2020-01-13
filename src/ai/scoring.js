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

const pickBest = fn => (a, b) => (() => {
  if (a.score === SCORE.UNKNOWN && b.score === SCORE.UNKNOWN) {
    return a.chance > b.chance ? a : b
  }
  if (a.score === SCORE.DRAW && b.score === SCORE.UNKNOWN) {
    return a
  }
  if (a.score === SCORE.UNKNOWN && b.score === SCORE.DRAW) {
    return b
  }
  return (fn(a.score, b.score)) ? a : b
})()

// :: [NodeResult] -> NodeResult
const findSuccessor = nrs => R.compose(
  nr => {
    const chance = R.compose(
      R.sum,
      R.reject(R.isNil),
      R.map(n => {
        if (n.score > SCORE.DRAW) return 1/n.score
        if (n.chance > 0) return n.chance/nrs.length
        return null
      }),
    )(nrs)
    if (chance > 0) {
      nr.chance = chance
    }
    return nr
  },
  R.reduce((prev, curr) =>
    !prev ? curr : pickBest(curr.isMax ? R.gt : R.lt)(curr, prev)
    , undefined
  )
)(nrs)

module.exports = {
  score,
  findSuccessor,
}
