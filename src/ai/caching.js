const R = require("ramda")
const { hash } = require("../board")
const { SCORE } = require("./datastructures")

// :: ... -> NodeResult
const withCache = (evalFn, persistentCache, transientCache) => (board, slots) => {
  const h = hash(board)
  const cached = persistentCache.get(h) || transientCache.get(h)
  if (cached) {
    return cached
  }
  const nodeResult = evalFn(board, slots)
  if (nodeResult.score !== SCORE.UNKNOWN) {
    persistentCache.set(h, nodeResult)
  } else {
    transientCache.set(h, nodeResult)
  }
  return nodeResult
}

module.exports = {
  withCache
}
