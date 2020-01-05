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
const score = (next, config, i, board) => {
  if (findWin(config.winningLength, board)) {
    // Game ends with win/lose:
    return Score(isMax(config.players, i) ? 1 : -1)
  }
  const nextSlots = freeSlots(board)
  if (nextSlots.length === 0) {
    // Game ends with draw:
    return Score(0)
  }
  // Game still open, continue searching:
  return next(i+1, board, nextSlots)
}

// :: bool -> [Number, Score] -> Score
const decide = (isMax) => isMax ? F.maxBy(r => r.score.value) : F.minBy(r => r.score.value)

// :: (………, [[any]], [Number]) -> Score
const evaluate = (config, stats) => (i, board, nextSlots) => R.compose(
  R.reduce((prev, {slot, nextBoard}) => {
    const nextFn = R.compose(R.prop("score"), evaluate(config, stats))
    const candidate = {slot, score: score(nextFn, config, i, nextBoard)}
    if (prev === undefined) {
      return candidate
    }
    return decide(isMax(config.players, i))([prev, candidate])
  }, undefined),
  R.map(slot => ({
    slot,
    nextBoard: putIntoSlot(playerOnTurn(config.players, i), slot, board)
  })),
  F.peek(() => stats.iterations++),
)(nextSlots)

const move = (winningLength, players, board) => {
  const stats = { iterations: 0 }
  const config = { players, winningLength }
  const slots = freeSlots(board)
  const res = evaluate(config, stats)(0, board, freeSlots(board), slots)
  return { ...res, ...stats }
}

module.exports = {
  move
}
