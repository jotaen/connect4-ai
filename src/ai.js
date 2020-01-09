const F = require("./lib/F")
const D = require("./lib/debug")
const R = require("ramda")
const {freeSlots, putIntoSlot, isWin} = require("./board")

const SCORE = {
  WIN: 1,
  LOST: -1,
  DRAW: 0,
  UNKNOWN: null,
}

// :: ([any], Number) -> any
const playerOnTurn = (players, iDepth) => players[iDepth%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, iDepth) => iDepth%players.length === 0

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
const Node = (config, iDepth, board) => slot => {
  const player = playerOnTurn(config.players, iDepth)
  const nextState = putIntoSlot(player, slot, board)
  return {
    board: nextState.board,
    field: nextState.field,
    isIterationLimit: iDepth >= config.maxIterationDepth,
    isMax: isMaxOnTurn(config.players, iDepth),
    depth: iDepth,
  }
}

// :: (...) -> [NodeResult] -> [NodeResult]
const deepening = (evalFn, config, board) => nodeResults => {
  const shouldDeepen = R.both(
    R.none(nr => nr.score > SCORE.DRAW),
    R.any(nr => nr.score === SCORE.UNKNOWN),
  )(nodeResults)
  if (!shouldDeepen) {
    return nodeResults
  }
  config.canDeepen = false
  config.maxIterationDepth = config.maxIterationDepth + 1
  return R.map(nr => {
    if (nr.score === SCORE.UNKNOWN && config.iterationCount < config.iterationBudget) {
      return evalFn(config, 0)(board, [nr.slot])
    }
    return nr
  })(nodeResults)
}

// :: Board -> [Number] -> [Number]
const prioritiseSlots = board => R.sort(F.compareCloseTo(Math.floor(board[0].length * 0.5)))

// :: (Config, Number) -> (Board, [Number]) -> NodeResult
const evaluate = (config, iDepth) => (board, nextSlots) => R.compose(
  findSuccessor,
  iDepth === 0 && config.canDeepen ? deepening(evaluate, config, board) : R.identity,
  mapWithPruning(node => {
    const nextFn = R.compose(R.prop("score"), evaluate(config, iDepth+1))
    return NodeResult(
      node.field.slot,
      score(nextFn, config, node),
      node.isMax,
    )
  }),
  R.map(Node(config, iDepth, board)),
  prioritiseSlots(board),
  F.peek(() => config.iterationCount++),
)(nextSlots)

const Config = (config, slots) => ({
  winningLength: config.winningLength,
  players: config.players,
  iterationBudget: config.iterationBudget,
  maxIterationDepth: Math.floor(Math.log(config.iterationBudget) / Math.log(slots.length)) || 1,
  iterationCount: 0,
  canDeepen: true,
})

// :: (NodeResult, Config) -> Move
const Move = (nodeResult, config) => ({
  slot: nodeResult.slot,
  score: nodeResult.score,
  maxIterationDepth: config.maxIterationDepth,
  iterationCount: config.iterationCount,
  isWin: nodeResult.score > SCORE.DRAW,
  isDraw: nodeResult.score === SCORE.DRAW,
  isLost: nodeResult.score < SCORE.DRAW,
  isUnknown: nodeResult.score === SCORE.UNKNOWN,
})

// :: ({}, Board) -> Move
const move = (configParams, board) => {
  const slots = freeSlots(board)
  const config = Config(configParams, slots)
  const nodeResult = evaluate(config, 0)(board, slots)
  return Move(nodeResult, config)
}

module.exports = {
  move,
}
