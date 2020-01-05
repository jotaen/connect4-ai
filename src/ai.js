const F = require("../lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// any -> [[any]] -> NextBoard
const NextBoard = (board, player) => slot =>
  ({slot, nextBoard: putIntoSlot(player, slot, board)})

// (Number, Number) -> Evaluation
const Evaluation = (slot, score) => ({slot, score})

// ([any], Number) -> any
const playerOnTurn = (players, i) => players[i%players.length]

// ([any], Number) -> Number
const isMax = (players, i) => i%players.length === 0

// [Evaluation] -> Evaluation
const decideMax = F.findMax(R.prop("score"))

// [Evaluation] -> Evaluation
const decideOpponent = F.findMin(R.prop("score"))

// (...) -> Evaluation
const evaluate = (stats, config, i, board, slotsToCheck) => R.compose(
  isMax(config.players, i) ? decideMax : decideOpponent,
  R.map(({slot, nextBoard}) => {
    if (findWin(config.winningLength, nextBoard)) {
      // Game ends with win/lose:
      return Evaluation(slot, isMax(config.players, i) ? 1 : -1)
    } else {
      const nextSlots = freeSlots(nextBoard)
      if (nextSlots.length > 0) {
        // Game still open, continue searching:
        const bs = evaluate(stats, config, i+1, nextBoard, nextSlots)
        return Evaluation(slot, bs.score)
      } else {
        // Game ends with draw:
        return Evaluation(slot, 0)
      }
    }
  }),
  R.map(NextBoard(board, playerOnTurn(config.players, i))),
  F.peek(() => stats.iterations++),
)(slotsToCheck)

// (Number, [any], [[any]]) -> move
const move = (winningLength, players, board) => {
  const stats = {
    iterations: 0
  }
  const config = { players, winningLength }
  const res = evaluate(stats, config, 0, board, freeSlots(board))
  return {
    ...res,
    ...stats,
  }
}

module.exports = {
  move
}
