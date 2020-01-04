const F = require("../lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// any -> [[any]] -> [[[any]]]
const nextBoards = (board, player) => R.map(s => [s, putIntoSlot(player, s, board)])

// ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// ... -> [Number, Number] | undefined
const minimax = (stats, winningLength, board, slotsToCheck, players, i) => R.compose(
  F.findMax(p => p[1]),
  R.map(p => {
    const behaveFactor = (i%players.length === 0) ? 1 : -1
    if (findWin(winningLength, p[1])) {
      return [p[0], 1*behaveFactor] // Game is won
    }
    const nextSlots = freeSlots(p[1])
    if (nextSlots.length > 0) {
      // Continue to search:
      return minimax(stats, winningLength, p[1], nextSlots, players, i+1)
    } else {
      return [p[0], 0] // Game ends with draw
    }
  }),
  nextBoards(board, playerOnTurn(players, i)),
  F.peek(() => stats.iterations++),
)(slotsToCheck)

// (Number, [any], [[any]]) -> Number
const nextSlot = (winningLength, players, board) => {
  const stats = {
    iterations: 0
  }
  const p = minimax(stats, winningLength, board, freeSlots(board), players, 0)
  return {
    nextSlot: p[0],
    value: p[1],
    ...stats,
  }
}

module.exports = {
  nextSlot
}
