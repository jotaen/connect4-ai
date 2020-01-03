const R = require("ramda")
const F = require("../lib/F")

// [id] -> id|null
const singularWinnerOrNull = R.compose(
  xs => xs.length === 1 && xs[0] !== null ? xs[0] : null,
  R.uniq,
)

// [id] -> [id]
const reduceToWinners = winningLength => R.compose(
  R.reject(R.isNil),
  R.chain(singularWinnerOrNull),
  R.aperture(winningLength),
)

const horizontalSeqs = R.identity
const verticalSeqs = R.transpose
const diagonalDownSeqs = F.transposeDiagonal
const diagonalUpSeqs = R.compose(F.transposeDiagonal, R.reverse)

// Number -> [[id]] -> [id]
const findWins = R.curry((winningLength, board) => R.compose(
  R.chain(reduceToWinners(winningLength)),
  R.unnest,
  R.juxt([horizontalSeqs, verticalSeqs, diagonalDownSeqs, diagonalUpSeqs]),
)(board))

// Number, Number -> [[null]]
const create = (rows, slots) => R.times(() => R.repeat(null, slots), rows)

// [[any]] -> [Number]
const freeSlots = R.compose(
  R.map(R.nth(0)),
  R.filter(p => R.isNil(p[1])),
  F.mapIndexed((v, i) => R.pair(i, v)),
  R.nth(0),
)

// Number -> [[any]] -> bool
const nextInSlot = R.curry((slotNr, board) => R.compose(
  i => i === -1 ? null : i,
  R.findLastIndex(R.isNil),
  R.nth(slotNr),
  R.transpose,
)(board))

module.exports = {
  create,
  findWins,
  freeSlots,
  nextInSlot,
}
