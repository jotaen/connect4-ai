const F = require("../lib/F")
const R = require("ramda")
const {freeSlots, putIntoSlot, findWin} = require("./board")

// [[any]] -> Number
const nextSlot = (winningLength, value, board) => R.compose(
  R.map(p => p[0]),
  R.reject(p => R.isNil(p[1])),
  R.map(p => [p[0], findWin(winningLength, p[1])]),
  R.reject(p => R.isNil(p[1])),
  R.map(s => [s, putIntoSlot(value, s, board)]),
  freeSlots,
)(board)[0]

module.exports = {
  nextSlot
}
