const R = require("ramda")
const F = require("./lib/F")

const NEUTRAL = null
const isNeutral = R.equals(NEUTRAL)

const Field = (row, slot, value) => ({ row, slot, value })

// :: [Field] -> bool
const allValuesEqual = R.compose(
  R.both(F.hasLength(1), R.none(isNeutral)),
  R.uniq(),
  R.map(R.prop('value')),
)

// :: [Field] -> [Field]
const seq = {
  horizontal: R.identity,
  vertical: R.transpose,
  diagonalDown: F.transposeDiagonal,
  diagonalUp: R.compose(F.transposeDiagonal, R.reverse),
}

// :: [[any]] -> [[Field]]
const boardValuesToFields = F.mapIndexed((ss, row) =>
  F.mapIndexed((value, slot) => ({row, slot, value}), ss))

// :: [[Field]] -> [[Field]]
const allEligibleSeqs = R.compose(
  R.unnest,
  R.juxt([seq.horizontal, seq.vertical, seq.diagonalDown, seq.diagonalUp])
)

const toCandidates = winningLength => R.compose(
  R.chain(R.aperture(winningLength)),
  R.filter(fs => fs.length >= winningLength),
)

// :: Number -> [[any]] -> [[Field]]
const findWin = R.curry((winningLength, board) => R.compose(
  w => w || null,
  R.find(allValuesEqual),
  toCandidates(winningLength),
  allEligibleSeqs,
  boardValuesToFields,
)(board))

// Number, Number -> [[NEUTRAL]]
const create = (rows, slots) => R.times(() => R.repeat(NEUTRAL, slots), rows)

// :: [[any]] -> [Number]
const freeSlots = R.compose(
  R.map(R.nth(0)),
  R.filter(p => isNeutral(p[1])),
  F.mapIndexed((v, i) => R.pair(i, v)),
  R.nth(0),
)

// :: [[any]] -> bool
const hasFreeSlots = R.compose(
  ns => ns.length > 0,
  R.filter(isNeutral),
  R.nth(0),
)

// :: Field, [[any]] -> [[any]]
const place = (Field, board) => R.compose(
  R.set(R.lensPath([Field.row, Field.slot]), Field.value),
  R.clone,
)(board)

// :: any, Number, [[any]] -> [[any]]
const putIntoSlot = R.curry((value, slot, board) => R.compose(
  row => row === -1 ? null : place({row, slot, value}, board),
  R.findLastIndex(R.isNil),
  R.nth(slot),
  R.transpose,
)(board))

module.exports = {
  create,
  Field,
  findWin,
  hasWin,
  freeSlots,
  hasFreeSlots,
  putIntoSlot,
}
