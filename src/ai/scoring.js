const R = require("ramda")
const F = require("../lib/F")
const { isWin, hasFreeSlots } = require("../board")
const { SCORE } = require("./datastructures")

// :: Config, Node -> Number
const score = (config, node) => {
  if (isWin(config.winningLength, node.board, node.field)) {
    return node.isMax ? SCORE.WIN : SCORE.LOST
  }
  if (!hasFreeSlots(node.board)) {
    return SCORE.DRAW
  }
  return SCORE.UNKNOWN
}

// :: NodeResult -> Number
const relScore = nr => nr.score === SCORE.UNKNOWN ? nr.score : nr.score / (nr.depth + 1)

// :: (Number, Number -> bool) -> Number, Number -> Number
const pickBest = compareFn => (a, b) => (() => {
  if (a.score === SCORE.UNKNOWN && b.score === SCORE.UNKNOWN) {
    return a.chance > b.chance ? a : b
  }
  if (a.score === SCORE.DRAW && b.score === SCORE.UNKNOWN) {
    return a
  }
  if (a.score === SCORE.UNKNOWN && b.score === SCORE.DRAW) {
    return b
  }
  return (compareFn(relScore(a), relScore(b))) ? a : b
})()

// :: [NodeResult] -> NodeResult
const findSuccessor = nrs => R.compose(
  nr => {
    const chance = R.compose(
      x => x/nrs.length,
      R.sum,
      R.reject(R.isNil),
      R.map(n => {
        if (n.score === SCORE.WIN) {
          return Math.pow(1/relScore(n), 2)
        }
        return n.chance
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
