const R = require("ramda")
const F = require("../lib/F")
const { SCORE } = require("./datastructures")

const skipPostProcess = () => () => R.identity

const canDeepen = R.both(
  R.none(nr => nr.score === SCORE.WIN),
  R.any(nr => nr.score === SCORE.UNKNOWN),
)

// :: (...) -> [NodeResult] -> [NodeResult]
const deepening = evalFn =>
  (config, stats, persistentCache, transientCache, maxItDepth, board) => R.compose(
    F.mapIterateUntil(
      nrs => canDeepen(nrs) && stats.iterationCount <= config.iterationBudget,
      (nr, loopCount) => {
        if (nr.score !== SCORE.UNKNOWN) {
          return nr
        }
        const nextDepth = maxItDepth + loopCount
        stats.maxDepth = nextDepth
        return evalFn(config, stats, persistentCache, new Map(), skipPostProcess, nextDepth, 0)(board, [nr.slot])
      }
    ),
    F.peek(() => stats.maxDepth = maxItDepth),
)

module.exports = {
  deepening,
  skipPostProcess,
}
