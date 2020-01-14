const R = require("ramda")
const { SCORE } = require("./datastructures")

const skipPostProcess = () => () => R.identity

// :: (...) -> [NodeResult] -> [NodeResult]
const deepening = evalFn => (config, stats, persistentCache, transientCache, maxItDepth, board) => nodeResults => {
  const canDeepen = R.allPass([
    R.none(nr => nr.score > SCORE.DRAW),
    R.any(nr => nr.score === SCORE.UNKNOWN),
  ])
  let currentItDepth = maxItDepth
  stats.maxDepth = currentItDepth
  for (let w=0; canDeepen(nodeResults) && stats.iterationCount <= config.iterationBudget; w++) {
    const i = w%nodeResults.length
    if (i === 0) {
      currentItDepth = currentItDepth + 1
      stats.maxDepth = currentItDepth
    }
    const nr = nodeResults[i]
    if (nr.score === SCORE.UNKNOWN) {
      nodeResults[i] = evalFn(config, stats, persistentCache, new Map(), skipPostProcess, currentItDepth, 0)(board, [nr.slot])
    }
  }
  return nodeResults
}

module.exports = {
  deepening,
  skipPostProcess,
}
