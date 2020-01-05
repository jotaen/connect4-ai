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

// :: ([[any]], [any], Number) -> Number -> Number, [[any]]
const generateNextBoard = (board, players, i) => slot => 
  putIntoSlot(playerOnTurn(players, i), slot, board)

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
const decide = (isMax) => isMax ? F.maxBy(s => s.value) : F.minBy(s => s.value)

// :: [Score] -> [Score*]     (* with additional prop `index`)
const addIndexes = F.mapIndexed((s, i) => {s.index = i; return s;})

// :: (………, [[any]], [Number]) -> Score*
const evaluate = (config, stats) => (i, board, nextSlots) => R.compose(
  decide(isMax(config.players, i)),
  i === 0 ? addIndexes : R.identity,
  R.map(nb => score(evaluate(config, stats), config, i, nb)),
  R.map(generateNextBoard(board, config.players, i)),
  F.peek(() => stats.iterations++),
)(nextSlots)

const move = (winningLength, players, board) => {
  const stats = { iterations: 0 }
  const config = { players, winningLength }
  const slots = freeSlots(board)
  const res = evaluate(config, stats)(0, board, freeSlots(board), slots)
  return { slot: slots[res.index], ...stats }
}

module.exports = {
  move
}
