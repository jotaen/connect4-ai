const F = require("../lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

const minimax = (winningLength, rootBoard, players, isMax, i) => R.compose(
  isMax ? R.last : R.head,
  R.sortBy(p => p[1]),
  R.map(p => findWin(winningLength, p[1]) ?
    [p[0], 1] // Game is won
    : freeSlots(p[1]).length >= 1 ? 
      minimax(winningLength, p[1], players, !isMax, i+1)
      : [p[0], 0] // Game ends with draw
  ),
  R.map(s => [s, putIntoSlot(players[i%players.length], s, rootBoard)]),
  freeSlots,
)(rootBoard)

// [[any]] -> Number
const nextSlot = (winningLength, players, board) => R.compose(
  R.nth(0),
  () => minimax(winningLength, board, players, true, 0),
)()

module.exports = {
  nextSlot
}
