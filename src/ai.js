const F = require("../lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// any -> [[any]] -> [[[any]]]
const nextBoards = (board, player) => R.map(slot =>
  ({slot, nextBoard: putIntoSlot(player, slot, board)}))

// ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// ([any], Number) -> Number
const isMax = (players, i) => i%players.length === 0

// (Number, Number) -> evaluation
const evaluation = (slot, score) => ({slot, score})

// [evaluation] -> evaluation
const decideMax = F.findMax(R.prop("score"))

// [evaluation] -> evaluation
const decideOpponent = F.findMin(R.prop("score"))

// (...) -> evaluation
const evaluate = (stats, winningLength, board, slotsToCheck, players, i) => R.compose(
  isMax(players, i) ? decideMax : decideOpponent,
  R.map(({slot, nextBoard}) => {
    if (findWin(winningLength, nextBoard)) {
      // Game ends with win/lose:
      return evaluation(slot, isMax(players, i) ? 1 : -1)
    } else {
      const nextSlots = freeSlots(nextBoard)
      if (nextSlots.length > 0) {
        // Game still open, continue searching:
        const bs = evaluate(stats, winningLength, nextBoard, nextSlots, players, i+1)
        return evaluation(slot, bs.score)
      } else {
        // Game ends with draw:
        return evaluation(slot, 0)
      }
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
  const res = evaluate(stats, winningLength, board, freeSlots(board), players, 0)
  return {
    ...res,
    ...stats,
  }
}

module.exports = {
  nextSlot
}
