const F = require("./lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// :: ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, i) => i%players.length === 0

// :: (………) -> Number
const minimax = (next, config, context, board) => {
  if (findWin(config.winningLength, board)) {
    // Game ends with win/lose:
    return context.isMax ? 1 : -1
  }
  const nextSlots = freeSlots(board)
  if (nextSlots.length === 0) {
    // Game ends with draw:
    return 0
  }
  // Game still open, max iteration depth reached:
  if (context.isIterationLimit) {
    return 0.5
  }
  // Game still open, continue searching:
  return next(board, nextSlots)
}

// :: [Edge] -> Edge
const makeDecision = R.reduce((prev, curr) => {
  const decide = curr.context.isMax ? F.maxBy(R.prop("score")) : F.minBy(R.prop("score"))
  return !prev ? curr : decide(prev, curr)
}, undefined)

// :: (a -> Edge) -> [a] -> [Edge]
const mapAlphaBeta = fn => R.compose(
  R.tail,
  R.scan((prev, curr) => {
    const isAlpha = (prev && curr.context.isMax && prev.score === 1)
    return isAlpha ? prev : fn(curr)
  }, undefined),
)

// :: (………, [[any]], [Number]) -> Edge
const evaluate = (config, stats, i) => (board, nextSlots) => R.compose(
  makeDecision,
  mapAlphaBeta(curr => {
    const nextFn = R.compose(R.prop("score"), evaluate(config, stats, i+1))
    return {
      slot: curr.slot,
      score: minimax(nextFn, config, curr.context, curr.board),
      context: curr.context,
    }
  }),
  R.map(slot => ({
    slot,
    board: putIntoSlot(playerOnTurn(config.players, i), slot, board),
    context: {
      isIterationLimit: i >= config.maxIterationDepth,
      isMax: isMaxOnTurn(config.players, i),
    },
  })),
  F.peek(() => stats.iterations++),
)(nextSlots)

const makeConfig = (config, slots) => Object.freeze({
  ...config,
  maxIterationDepth: Math.floor(Math.log(config.iterationBudget) / Math.log(slots.length)) || 1
})

const move = (configParams, board) => {
  const stats = { iterations: 0 }
  const slots = freeSlots(board)
  const config = makeConfig(configParams, slots)
  const res = evaluate(config, stats, 0)(board, slots)
  return { ...res, ...stats, maxIterationDepth: config.maxIterationDepth }
}

module.exports = {
  move
}
