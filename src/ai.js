const F = require("./lib/F")
const D = require("./lib/debug")
const R = require("ramda")
const {freeSlots, putIntoSlot, isWin} = require("./board")

// :: ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, i) => i%players.length === 0

// :: (((Board, [Number]) -> Number), Board, Node) -> Number
const minimax = (next, config, node) => {
  if (isWin(config.winningLength, node.board, node.field)) {
    // Game ends with win/lose:
    return node.isMax ? 1 : -1
  }
  const nextSlots = freeSlots(node.board)
  if (nextSlots.length === 0) {
    // Game ends with draw:
    return 0
  }
  // Game still open, max iteration depth reached:
  if (node.isIterationLimit) {
    return 0.5
  }
  // Game still open, continue searching:
  return next(node.board, nextSlots)
}

// :: [Node] -> Node
const makeDecision = R.reduce((prev, curr) => {
  const decide = curr.isMax ? F.maxBy(R.prop("score")) : F.minBy(R.prop("score"))
  return !prev ? curr : decide(prev, curr)
}, undefined)

// :: (Node -> Node) -> [Node] -> [Node]
const mapAlphaBeta = fn => R.compose(
  R.tail,
  R.scan((prevNode, currNode) => {
    const shouldCutOff = (prevNode && currNode.isMax && prevNode.score === 1)
    return shouldCutOff ? prevNode : fn(currNode)
  }, undefined),
)

const Node = () => ({
  score: undefined,
  board: nextState.board,
  field: nextState.field,
  isIterationLimit: i >= config.maxIterationDepth,
  isMax: isMaxOnTurn(config.players, i),
})

// :: Board -> [Number] -> [Number]
const prioritiseSlots = board => R.sort(F.compareCloseTo(Math.floor(board[0].length * 0.5)))

// :: (………, Board, [Number]) -> Node
const evaluate = (config, stats, i) => (board, nextSlots) => R.compose(
  makeDecision,
  mapAlphaBeta(node => {
    const nextFn = R.compose(R.prop("score"), evaluate(config, stats, i+1))
    node.score = minimax(nextFn, config, node)
    return node
  }),
  R.map(slot => {
    const player = playerOnTurn(config.players, i)
    const nextState = putIntoSlot(player, slot, board)
    return {
      score: undefined,
      board: nextState.board,
      field: nextState.field,
      isIterationLimit: i >= config.maxIterationDepth,
      isMax: isMaxOnTurn(config.players, i),
  }}),
  F.peek(() => stats.iterations++),
  prioritiseSlots(board),
)(nextSlots)

const Config = (config, slots) => Object.freeze({
  winningLength: config.winningLength,
  players: config.players,
  iterationBudget: config.iterationBudget,
  maxIterationDepth: Math.floor(Math.log(config.iterationBudget) / Math.log(slots.length)) || 1
})

const Move = (node, config, stats) => ({
  slot: node.field.slot,
  score: node.score,
  maxIterationDepth: config.maxIterationDepth,
  iterationCounter: stats.iterations,
})

// :: (Config.Params, Board) -> Move
const move = (configParams, board) => {
  const stats = { iterations: 0 }
  const slots = freeSlots(board)
  const config = Config(configParams, slots)
  const node = evaluate(config, stats, 0)(board, slots)
  return Move(node, config, stats)
}

module.exports = {
  move
}
