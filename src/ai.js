const F = require("./lib/F")
const D = require("./lib/debug")
const R = require("ramda")
const {freeSlots, putIntoSlot, isWin} = require("./board")

const SCORE = {
  WIN: 1,
  LOST: -1,
  DRAW: 0,
  UNKNOWN: 0.5, // TODO
}

// :: ([any], Number) -> any
const playerOnTurn = (players, iDepth) => players[iDepth%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, iDepth) => iDepth%players.length === 0

// :: (((Board, [Number]) -> Number), Board, Node) -> Number
const minimax = (next, config, node) => {
  if (isWin(config.winningLength, node.board, node.field)) {
    return node.isMax ? SCORE.WIN : SCORE.LOST
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
const NodeResult = (slot, score, isMax, slotScores) => ({
  slot,
  score,
  isMax,
  slotScores,
})

// :: [NodeResult] -> NodeResult
const findSuccessor = R.reduce((prev, curr) => {
  const decide = curr.isMax ? F.maxBy(R.prop("score")) : F.minBy(R.prop("score"))
  return !prev ? curr : decide(prev, curr)
}, undefined)

// :: [NodeResult] -> NodeResult
const reconcile = R.converge((successor, allScores) => NodeResult(
  successor.slot, successor.score, successor.isMax, allScores
), [findSuccessor, R.map(nr => [nr.slot, nr.score])])

// :: (Node -> Node) -> [Node] -> [NodeResult]
const mapWithAlphaBetaPruning = evaluateFn => R.compose(
  R.tail,
  R.scan((prevNode, node) => {
    const shouldCutOff = (prevNode && (
      (node.isMax && prevNode.score === SCORE.WIN)
      || (!node.isMax && prevNode.score === SCORE.LOST)
      ))
    if (shouldCutOff) {
      return NodeResult(node.field.slot, SCORE.UNKNOWN, node.isMax)
    }
    return evaluateFn(node)
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
  }
}

// :: Board -> [Number] -> [Number]
const prioritiseSlots = board => R.sort(F.compareCloseTo(Math.floor(board[0].length * 0.5)))

// :: (………, Board, [Number]) -> NodeResult
const evaluate = (config, stats, iDepth) => (board, nextSlots) => R.compose(
  reconcile,
  mapWithAlphaBetaPruning(node => {
    const nextFn = R.compose(R.prop("score"), evaluate(config, stats, iDepth+1))
    return NodeResult(
      node.field.slot,
      minimax(nextFn, config, node),
      node.isMax,
    )
  }),
  R.map(Node(config, iDepth, board)),
  F.peek(() => stats.iterations++),
  prioritiseSlots(board),
)(nextSlots)

const Config = (config, slots) => Object.freeze({
  winningLength: config.winningLength,
  players: config.players,
  iterationBudget: config.iterationBudget,
  maxIterationDepth: Math.floor(Math.log(config.iterationBudget) / Math.log(slots.length)) || 1
})

// :: (NodeResult, Config, {}) -> Move
const Move = (nodeResult, config, stats) => ({
  slot: nodeResult.slot,
  score: nodeResult.score,
  slotScores: nodeResult.slotScores,
  maxIterationDepth: config.maxIterationDepth,
  iterationCounter: stats.iterations,
})

// :: (Config.Params, Board) -> Move
const move = (configParams, board) => {
  const stats = { iterations: 0 }
  const slots = freeSlots(board)
  const config = Config(configParams, slots)
  const nodeResult = evaluate(config, stats, 0)(board, slots)
  return Move(nodeResult, config, stats)
}

module.exports = {
  move
}
