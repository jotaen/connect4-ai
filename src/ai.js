const F = require("../lib/F")
const D = require("../lib/debug")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// :: Number -> Score
const Score = (value) => ({value})

// :: ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// :: ([any], Number) -> Number
const isMax = (players, i) => i%players.length === 0

// :: (………) -> Score
const score = (next, config, max, board) => {
  if (findWin(config.winningLength, board)) {
    // Game ends with win/lose:
    return Score(max ? 1 : -1)
  }
  const nextSlots = freeSlots(board)
  if (nextSlots.length === 0) {
    // Game ends with draw:
    return Score(0)
  }
  // Game still open, continue searching:
  return next(board, nextSlots)
}

// :: bool -> [Number, Score] -> Score
const decide = (isMax) => isMax ? F.maxBy(r => r.score.value) : F.minBy(r => r.score.value)

// :: (………, [[any]], [Number]) -> Score
const evaluate = (config, stats, i) => (board, nextSlots) => R.compose(
  R.reduce((prev, {slot, nextBoard}) => {
    const max = isMax(config.players, i)
    if (max && prev && prev.score.value === 1) {
      return prev
    }
    const nextFn = R.compose(R.prop("score"), evaluate(config, stats, i+1))
    const candidate = {slot, score: score(nextFn, config, max, nextBoard)}
    if (!prev) {
      return candidate
    }
    return decide(max)([prev, candidate])
  }, undefined),
  R.map(slot => ({
    slot,
    nextBoard: putIntoSlot(playerOnTurn(config.players, i), slot, board)
  })),
  F.peek(() => stats.iterations++),
)(nextSlots)

const move = (winningLength, players, board) => {
  const stats = { iterations: 0 }
  const config = Object.freeze({ players, winningLength })
  const slots = freeSlots(board)
  const res = evaluate(config, stats, 0)(board, freeSlots(board), slots)
  return { ...res, ...stats }
}

module.exports = {
  move
}
