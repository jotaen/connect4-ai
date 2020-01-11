const R = require("ramda")
const { SCORE } = require("./datastructures")

const skipPostProcess = () => R.identity

// :: (...) -> [NodeResult] -> [NodeResult]
const deepening = (evalFn, config, persistentCache, transientCache, board) => nodeResults => {
  const canDeepen = R.allPass([
    R.none(nr => nr.score > SCORE.DRAW),
    R.any(nr => nr.score === SCORE.UNKNOWN),
  ])
  for (let w=0; canDeepen(nodeResults) && config.iterationCount <= config.iterationBudget; w++) {
    const i = w%nodeResults.length
    if (i === 0) {
      config.maxIterationDepth = config.maxIterationDepth + 1
    }
    const nr = nodeResults[i]
    if (nr.score === SCORE.UNKNOWN) {
      nodeResults[i] = evalFn(config, persistentCache, new Map(), skipPostProcess, 0)(board, [nr.slot])
    }
  }
  return nodeResults
}

module.exports = {
  deepening,
  skipPostProcess,
}
