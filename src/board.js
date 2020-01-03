const R = require("ramda")
const F = require("../lib/F")

const NEUTRAL = null
const isNeutral = R.equals(NEUTRAL)

const field = (row, slot, value) => ({ row, slot, value })

// [field] -> bool
const allValuesEqual = R.compose(
  R.both(F.hasLength(1), R.none(isNeutral)),
  R.uniq(),
  R.map(R.prop('value')),
)

// [field] -> [field]
const seq = {
  horizontal: R.identity,
  vertical: R.transpose,
  diagonalDown: F.transposeDiagonal,
  diagonalUp: R.compose(F.transposeDiagonal, R.reverse),
}

// [[any]] -> [[field]]
const boardValuesToFields = F.mapIndexed((ss, row) =>
  F.mapIndexed((value, slot) => ({row, slot, value}), ss))

// [[field]] -> [[field]]
const allEligibleSeqs = R.compose(
  R.unnest,
  R.juxt([seq.horizontal, seq.vertical, seq.diagonalDown, seq.diagonalUp])
)

const toCandidates = winningLength => R.compose(
  R.chain(R.aperture(winningLength)),
  R.filter(fs => fs.length >= winningLength),
)

// Number -> [[any]] -> [[field]]
const findWin = R.curry((winningLength, board) => R.compose(
  w => w || null,
  R.find(allValuesEqual),
  toCandidates(winningLength),
  allEligibleSeqs,
  boardValuesToFields,
)(board))

// Number, Number -> [[NEUTRAL]]
const create = (rows, slots) => R.times(() => R.repeat(NEUTRAL, slots), rows)

// [[any]] -> [Number]
const freeSlots = R.compose(
  R.map(R.nth(0)),
  R.filter(p => isNeutral(p[1])),
  F.mapIndexed((v, i) => R.pair(i, v)),
  R.nth(0),
)

// field, [[any]] -> [[any]]
const place = (field, board) => R.compose(
  R.set(R.lensPath([field.row, field.slot]), field.value),
  R.clone,
)(board)

// Number -> [[any]] -> bool
const putIntoSlot = R.curry((value, slot, board) => R.compose(
  row => row === -1 ? null : place({row, slot, value}, board),
  R.findLastIndex(R.isNil),
  R.nth(slot),
  R.transpose,
)(board))

module.exports = {
  create,
  field,
  findWin,
  freeSlots,
  putIntoSlot,
}
