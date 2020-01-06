const R = require("ramda")
const F = require("./lib/F")
const D = require("./lib/debug")

const NEUTRAL = null
const isNeutral = R.equals(NEUTRAL)

const Field = (row, slot, value) => ({ row, slot, value })

// :: [Field] -> bool
const allValuesEqual = provider => R.compose(
  R.both(F.hasLength(1), R.none(isNeutral)),
  R.uniq(),
  R.map(provider)
)

// :: [[any]] -> [[any]]
const seqs = {
  horizontal: R.identity,
  vertical: R.transpose,
  diagonalDown: F.transposeDiagonal,
  diagonalUp: R.compose(F.transposeDiagonal, R.reverse),
}

// :: [[any]] -> [[any]]
const allEligibleSeqs = R.compose(
  R.unnest,
  R.juxt([seqs.horizontal, seqs.vertical, seqs.diagonalDown, seqs.diagonalUp])
)

// :: Number -> [[any]] -> [any]
const findWinningSequence = (provider, winningLength) => R.compose(
  R.find(allValuesEqual(provider)),
  R.chain(R.aperture(winningLength)),
  R.filter(fs => fs.length >= winningLength),
)

// :: [[any]] -> [[Field]]
const boardValuesToFields = F.mapIndexed((ss, row) =>
  F.mapIndexed((value, slot) => ({row, slot, value}), ss))

// :: Number -> [[any]] -> [[Field]]
const findWin = R.curry((winningLength, board) => R.compose(
  w => w || null,
  findWinningSequence(R.prop('value'), winningLength),
  allEligibleSeqs,
  boardValuesToFields,
)(board))

const diagonal = (x, y, k) => matrix => {
  const step = (res, d) => {
    const left = R.pathOr(NEUTRAL, [x-d, [y-(d*k)]], matrix)
    const right = R.pathOr(NEUTRAL, [x+d, [y+(d*k)]], matrix)
    const isBothOverflown = (left === null && right === null)
    return isBothOverflown ? res : step([left, ...res, right], d+1)
  }
  return step([matrix[x][y]], 1)
}

// :: Field -> [[any]] -> [[any]]
const eligibleSeqsForPlacement = (winningLength, placement) => R.juxt([
  board => board[placement.row], // horizontal line
  R.map(r => r[placement.slot]), // vertical line
  diagonal(placement.row, placement.slot, 1),
  diagonal(placement.row, placement.slot, -1),
])

// :: Number -> [[any]] -> Field -> bool
const isWin = R.curry((winningLength, board, lastPlacement) => R.compose(
  w => !!w,
  findWinningSequence(R.identity, winningLength),
  eligibleSeqsForPlacement(winningLength, lastPlacement),
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
  field => field === null ? null : {
    field,
    board: place(field, board),
  },
  row => row === -1 ? null : Field(row, slot, value),
  R.findLastIndex(R.isNil),
  R.nth(slot),
  R.transpose,
)(board))

module.exports = {
  create,
  Field,
  findWin,
  isWin,
  freeSlots,
  hasFreeSlots,
  putIntoSlot,
}
