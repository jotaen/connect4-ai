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
const { SCORE, Config, NodeResult, Node } = require("./datastructures")

// :: (NodeResult, Config) -> Move
const Move = (nodeResult, config, startTs) => ({
  slot: nodeResult.slot,
  score: nodeResult.score,
  maxIterationDepth: config.maxIterationDepth,
  iterationCount: config.iterationCount,
  isWin: nodeResult.score > SCORE.DRAW,
  isDraw: nodeResult.score === SCORE.DRAW,
  isLost: nodeResult.score < SCORE.DRAW,
  isUnknown: nodeResult.score === SCORE.UNKNOWN,
  time: Date.now() - startTs,
})

// :: (Config, ([NodeResult] -> [NodeResult]), Number) -> (Board, [Number]) -> NodeResult
const evaluate = (config, persistentCache, transientCache, postprocess, itDepth) =>
  withCache((board, nextSlots) => R.compose(
    findSuccessor,
    postprocess(evaluate, config, persistentCache, transientCache, board),
    mapWithPruning(node => {
      const nextFn = evaluate(config, persistentCache, transientCache, skipPostProcess, itDepth+1)
      const s = score(config, node)
      const shouldGoDeeper = (s === SCORE.UNKNOWN && itDepth < config.maxIterationDepth)
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
    F.peek(() => config.iterationCount++),
  )(nextSlots), persistentCache, transientCache)

const topLevelProcessing = config => (...args) => R.compose(
  randomise(config.random),
  deepening(...args),
)

// :: ({}, Board) -> Move
const move = (userOpts, board) => {
  const slots = freeSlots(board)
  const config = Config(userOpts, slots)
  const startTs = Date.now()
  const nodeResult = evaluate(
    config,
    new Map(),
    new Map(),
    topLevelProcessing(config),
    0
  )(board, slots)
  return Move(nodeResult, config, startTs)
}

module.exports = {
  move,
}
