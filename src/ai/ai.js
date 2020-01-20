const F = require("../lib/F")
const D = require("../lib/debug")
const R = require("ramda")
const { freeSlots } = require("../board")
const { findSuccessor, score } = require("./scoring")
const { deepening, skipPostProcess } = require("./deepening")
const { mapWithPruning } = require("./pruning")
const { prioritiseSlots } = require("./predicting")
const { withCache } = require("./caching")
const { randomiseChance } = require("./randomising")
const { SCORE, Config, NodeResult, Node, Stats } = require("./datastructures")

const toNodeResult = evalFn => (config, stats, persistentCache, transientCache) => node => {
  const currScore = score(config, node)
  const shouldGoDeeper = (currScore === SCORE.UNKNOWN && node.depth < node.maxDepth)
  if (shouldGoDeeper) {
    const dnr = evalFn(config, stats, persistentCache, transientCache, skipPostProcess, node.maxDepth, node.depth+1)(node.board, freeSlots(node.board))
    return NodeResult(node.field.slot, dnr.score, node.isMax, dnr.chance, dnr.depth)
  }
  return NodeResult(node.field.slot, currScore, node.isMax, undefined, node.depth)
}

// :: Config, Stats, Map, Map, ([NodeResults] -> [NodeResults]), Number, Number, Board, [Number] -> NodeResult
const evaluate = R.curry((config, stats, persistentCache, transientCache, postprocessFn, maxItDepth, itDepth) =>
  withCache((board, nextSlots) => R.compose(
    findSuccessor,
    postprocessFn(evaluate)(config, stats, persistentCache, transientCache, maxItDepth, board),
    mapWithPruning(toNodeResult(evaluate)(config, stats, persistentCache, transientCache)),
    R.map(Node(config, maxItDepth, itDepth, board)),
    prioritiseSlots(board),
    F.peek(() => stats.iterationCount++),
  )(nextSlots), persistentCache, transientCache)
)

const topLevelProcessing = config => evalFn => (...args) => R.compose(
  randomiseChance(config.random),
  deepening(evalFn)(...args),
)

// :: ({…}, Board) -> Move
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
    depth: nodeResult.depth,
    maxIterationDepth: stats.maxDepth,
    iterationCount: stats.iterationCount,
    runtimeMs: endTs - startTs
  }
}

module.exports = {
  move,
}
