const R = require("ramda")
const F = require("../lib/F")
const { SCORE } = require("./datastructures")

const skipPostProcess = () => () => R.identity

const mapIterateUntil = (predicate, fn) => xs => {
  let loopCount = 0
  for (let i=0; predicate(xs); i++) {
    const index = i%xs.length
    if (index === 0) {
      loopCount++
    }
    xs[index] = fn(xs[index], loopCount)
  }
  return xs
}

const canDeepen = R.allPass([
  R.none(nr => nr.score > SCORE.DRAW),
  R.any(nr => nr.score === SCORE.UNKNOWN),
])

// :: (...) -> [NodeResult] -> [NodeResult]
const deepening = evalFn =>
  (config, stats, persistentCache, transientCache, maxItDepth, board) => R.compose(
    mapIterateUntil(
      nrs => canDeepen(nrs) && stats.iterationCount <= config.iterationBudget,
      (nr, loopCount) => {
        if (nr.score === SCORE.UNKNOWN) {
          const nextDepth = maxItDepth + loopCount
          stats.maxDepth = nextDepth
          return evalFn(config, stats, persistentCache, new Map(), skipPostProcess, nextDepth, 0)(board, [nr.slot])
        }
        return nr
      }
    ),
    F.peek(() => stats.maxDepth = maxItDepth),
)

module.exports = {
  deepening,
  skipPostProcess,
}
