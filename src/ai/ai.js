const F = require("../lib/F")
const D = require("../lib/debug")
const R = require("ramda")
const { freeSlots } = require("../board")
const { findSuccessor, score } = require("./scoring")
const { deepening, skipPostProcess } = require("./deepening")
const { mapWithPruning } = require("./pruning")
const { prioritiseSlots } = require("./predicting")
const { withCache } = require("./caching")
const { randomise } = require("./randomising")
const { SCORE, Config, NodeResult, Node, Stats } = require("./datastructures")

// :: (Config, ([NodeResult] -> [NodeResult]), Number) -> (Board, [Number]) -> NodeResult
const evaluate = (config, stats, persistentCache, transientCache, postprocessFn, maxItDepth, itDepth) =>
  withCache((board, nextSlots) => R.compose(
    findSuccessor,
    postprocessFn(evaluate)(config, stats, persistentCache, transientCache, maxItDepth, board),
    mapWithPruning(node => {
      const nextFn = evaluate(config, stats, persistentCache, transientCache, skipPostProcess, maxItDepth, itDepth+1)
      const s = score(config, node)
      const shouldGoDeeper = (s === SCORE.UNKNOWN && itDepth < maxItDepth)
      const nr = shouldGoDeeper ? nextFn(node.board, freeSlots(node.board)) : {score: s}
      return NodeResult(
        node.field.slot,
        nr.score,
        node.isMax,
        nr.chance,
      )
    }),
    R.map(Node(config, itDepth, board)),
    prioritiseSlots(board),
    F.peek(() => stats.iterationCount++),
  )(nextSlots), persistentCache, transientCache)

const topLevelProcessing = config => evalFn => (...args) => R.compose(
  randomise(config.random),
  deepening(evalFn)(...args),
)

// :: ({...}, Board) -> {...}
const move = (userOpts, board) => {
  const slots = freeSlots(board)
  const config = Config(userOpts, slots)
  const stats = Stats()
  const startTs = Date.now()
  const nodeResult = evaluate(
    config,
    stats,
    new Map(),
    new Map(),
    topLevelProcessing(config),
    Math.floor(Math.log(config.iterationBudget) / Math.log(slots.length)) || 1,
    0
  )(board, slots)
  const endTs = Date.now()
  return {
    slot: nodeResult.slot,
    score: nodeResult.score,
    isWin: nodeResult.score > SCORE.DRAW,
    isDraw: nodeResult.score === SCORE.DRAW,
    isLost: nodeResult.score < SCORE.DRAW,
    isUnknown: nodeResult.score === SCORE.UNKNOWN,
    maxIterationDepth: stats.maxDepth,
    iterationCount: stats.iterationCount,
    runtimeMs: endTs - startTs
  }
}

module.exports = {
  move,
}
