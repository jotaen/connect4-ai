const R = require("ramda")
const {Either} = require("ramda-fantasy")
const F = require("../lib/F")

// field :: {row: Number, slot: Number, value: id}

const NEUTRAL = null
const isNeutral = R.equals(NEUTRAL)

// [field] -> bool
const isWinningSequence = R.compose(
  R.both(F.hasLength(1), R.none(isNeutral)),
  R.uniq(),
  R.map(R.prop('value')),
)

// [field] -> [[field]]
const reduceToWinners = winningLength => R.compose(
  R.filter(isWinningSequence),
  R.aperture(winningLength),
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

// Number -> [[any]] -> [[field]]
const findWins = R.curry((winningLength, board) => R.compose(
  R.chain(reduceToWinners(winningLength)),
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

const place = (field, board) => {
  const newBoard = R.clone(board)
  newBoard[field.row][field.slot] = field.value
  return newBoard
}

// Number -> [[any]] -> bool
const putIntoSlot = R.curry((value, slot, board) => R.compose(
  row => row === -1 ?
    Either.Left("SLOT_IS_FULL") :
    Either.Right(place({row, slot, value}, board)),
  R.findLastIndex(R.isNil),
  R.nth(slot),
  R.transpose,
)(board))

module.exports = {
  create,
  findWins,
  freeSlots,
  putIntoSlot,
}
