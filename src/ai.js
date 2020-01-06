const F = require("./lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// :: ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, i) => i%players.length === 0

// :: (………) -> Number
const score = (next, config, context, board) => {
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

// :: bool -> [Edge] -> Edge
const decide = (isMax) => isMax ? F.maxBy(R.prop("score")) : F.minBy(R.prop("score"))

// :: (………, [[any]], [Number]) -> Edge
const evaluate = (config, stats, i) => (board, nextSlots) => R.compose(
  R.reduce((prev, curr) => {
    const context = {
      isIterationLimit: i >= config.maxIterationDepth,
      isMax: isMaxOnTurn(config.players, i),
    }
    if (context.isMax && prev && prev.score === 1) {
      return prev
    }
    const nextFn = R.compose(R.prop("score"), evaluate(config, stats, i+1))
    const candidate = {
      slot: curr.slot,
      score: score(nextFn, config, context, curr.board)
    }
    if (!prev) {
      return candidate
    }
    return decide(context.isMax)(prev, candidate)
  }, undefined),
  R.map(slot => ({
    slot,
    board: putIntoSlot(playerOnTurn(config.players, i), slot, board)
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
