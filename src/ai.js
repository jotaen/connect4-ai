const F = require("../lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

const findMax = fn => R.compose(R.last, R.sortBy(fn))

const minimax = (stats, winningLength, board, players, isMax, i) => R.compose(
  findMax(p => p[1]),
  // F._print,
  R.map(p => findWin(winningLength, p[1]) ?
    [p[0], isMax ? 1 : -1] // Game is won
    : (minimax(stats, winningLength, p[1], players, !isMax, i+1)
      || [p[0], 0]) // Game ends with draw
  ),
  b => R.compose(
    R.map(s => [s, putIntoSlot(players[i%players.length], s, b)]),
    freeSlots,
  )(b),
  x => { stats.iterations++; return x; },
)(board)

// [[any]] -> Number
const nextSlot = (winningLength, players, board) => {
  const stats = {
    iterations: 0
  }
  const p = minimax(stats, winningLength, board, players, true, 0)
  return {
    nextSlot: p[0],
    value: p[1],
    ...stats,
  }
}

module.exports = {
  nextSlot
}
