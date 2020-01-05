const F = require("./lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// :: ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, i) => i%players.length === 0

// :: (………) -> Number
const score = (next, config, max, board) => {
  if (findWin(config.winningLength, board)) {
    // Game ends with win/lose:
    return max ? 1 : -1
  }
  const nextSlots = freeSlots(board)
  if (nextSlots.length === 0) {
    // Game ends with draw:
    return 0
  }
  // Game still open, continue searching:
  return next(board, nextSlots)
}

// :: bool -> [Edge] -> Edge
const decide = (isMax) => isMax ? F.maxBy(R.prop("score")) : F.minBy(R.prop("score"))

// :: (………, [[any]], [Number]) -> Edge
const evaluate = (config, stats, i) => (board, nextSlots) => R.compose(
  R.reduce((prev, curr) => {
    const isMax = isMaxOnTurn(config.players, i)
    if (isMax && prev && prev.score === 1) {
      return prev
    }
    const nextFn = R.compose(R.prop("score"), evaluate(config, stats, i+1))
    const candidate = {
      slot: curr.slot,
      score: score(nextFn, config, isMax, curr.board)
    }
    if (!prev) {
      return candidate
    }
    return decide(isMax)(prev, candidate)
  }, undefined),
  R.map(slot => ({
    slot,
    board: putIntoSlot(playerOnTurn(config.players, i), slot, board)
  })),
  F.peek(() => stats.iterations++),
)(nextSlots)

const move = (config, board) => {
  const stats = { iterations: 0 }
  const slots = freeSlots(board)
  const res = evaluate(config, stats, 0)(board, freeSlots(board), slots)
  return { ...res, ...stats }
}

module.exports = {
  move
}
