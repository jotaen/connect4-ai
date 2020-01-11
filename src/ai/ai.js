const F = require("../lib/F")
const D = require("../lib/debug")
const R = require("ramda")
const {freeSlots, putIntoSlot, isWin, hash} = require("../board")

const SCORE = {
  WIN: 1,
  LOST: -1,
  DRAW: 0,
  UNKNOWN: null,
}

// :: ([any], Number) -> any
const playerOnTurn = (players, itDepth) => players[itDepth%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, itDepth) => itDepth%players.length === 0

// :: (((Board, [Number]) -> Number), Config, Node) -> Number
const score = (next, config, node) => {
  if (isWin(config.winningLength, node.board, node.field)) {
    const value = node.isMax ? SCORE.WIN : SCORE.LOST
    return value / (node.depth + 1)
  }
  const nextSlots = freeSlots(node.board)
  if (nextSlots.length === 0) {
    return SCORE.DRAW
  }
  if (node.isIterationLimit) {
    return SCORE.UNKNOWN
  }
  return next(node.board, nextSlots)
}

// :: (Number, Number, bool) -> NodeResult
const NodeResult = (slot, score, isMax) => ({
  slot,
  score,
  isMax,
})

// :: [NodeResult] -> NodeResult
const findSuccessor = R.reduce((prev, curr) => {
  const decide = curr.isMax ? F.maxBy(R.prop("score")) : F.minBy(R.prop("score"))
  return !prev ? curr : decide(curr, prev)
}, undefined)

// :: (Node -> NodeResult) -> [Node] -> [NodeResult]
const mapWithPruning = evaluateFn => R.compose(
  R.tail,
  R.scan((prev, curr) => {
    const shouldCutOff = (prev && (
      (curr.isMax && prev.score > SCORE.DRAW)
      || (!curr.isMax && prev.score === SCORE.LOST) // only prune when loss is “close”
      ))
    if (shouldCutOff) {
      return NodeResult(curr.field.slot, SCORE.UNKNOWN, curr.isMax)
    }
    return evaluateFn(curr)
}, undefined))

// :: (Config, Number, Board) -> Number -> Node
const Node = (config, itDepth, board) => slot => {
  const player = playerOnTurn(config.players, itDepth)
  const nextState = putIntoSlot(player, slot, board)
  return {
    board: nextState.board,
    field: nextState.field,
    isIterationLimit: itDepth >= config.maxIterationDepth,
    isMax: isMaxOnTurn(config.players, itDepth),
    depth: itDepth,
  }
}

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

// :: Board -> [Number] -> [Number]
const prioritiseSlots = board => R.sort(F.compareCloseTo(Math.floor(board[0].length * 0.5)))

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

// :: (Config, ([NodeResult] -> [NodeResult]), Number) -> (Board, [Number]) -> NodeResult
const evaluate = (config, persistentCache, transientCache, postprocess, itDepth) =>
  withCache((board, nextSlots) => R.compose(
    findSuccessor,
    postprocess(evaluate, config, persistentCache, transientCache, board),
    mapWithPruning(node => {
      const nextFn = R.compose(R.prop("score"), evaluate(config, persistentCache, transientCache, skipPostProcess, itDepth+1))
      return NodeResult(
        node.field.slot,
        score(nextFn, config, node),
        node.isMax,
      )
    }),
    R.map(Node(config, itDepth, board)),
    prioritiseSlots(board),
    F.peek(() => config.iterationCount++),
  )(nextSlots), persistentCache, transientCache)

const Config = (userOpts, slots) => ({
  winningLength: userOpts.winningLength,
  players: userOpts.players,
  iterationBudget: userOpts.iterationBudget,
  maxIterationDepth: Math.floor(Math.log(userOpts.iterationBudget) / Math.log(slots.length)) || 1,
  iterationCount: 0,
})

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

// :: ({}, Board) -> Move
const move = (userOpts, board) => {
  const slots = freeSlots(board)
  const config = Config(userOpts, slots)
  const startTs = Date.now()
  const nodeResult = evaluate(config, new Map(), new Map(), deepening, 0)(board, slots)
  return Move(nodeResult, config, startTs)
}

module.exports = {
  move,
}
