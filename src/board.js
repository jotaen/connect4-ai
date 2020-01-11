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

// :: Board -> Board
const seqs = {
  horizontal: R.identity,
  vertical: R.transpose,
  diagonalDown: F.transposeDiagonal,
  diagonalUp: R.compose(F.transposeDiagonal, R.reverse),
}

// :: Board -> Board
const allEligibleSeqs = R.compose(
  R.unnest,
  R.juxt([seqs.horizontal, seqs.vertical, seqs.diagonalDown, seqs.diagonalUp])
)

// :: Number -> Board -> [any]
const findWinningSequence = (provider, winningLength) => R.compose(
  R.find(allValuesEqual(provider)),
  R.chain(R.aperture(winningLength)),
  R.filter(fs => fs.length >= winningLength),
)

// :: Board -> [[Field]]
const boardValuesToFields = F.mapIndexed((ss, row) =>
  F.mapIndexed((value, slot) => ({row, slot, value}), ss))

// :: Number -> Board -> [[Field]]
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

// :: Field -> Board -> Board
const eligibleSeqsForPlacement = (winningLength, placement) => R.juxt([
  board => board[placement.row], // horizontal line
  R.map(r => r[placement.slot]), // vertical line
  diagonal(placement.row, placement.slot, 1),
  diagonal(placement.row, placement.slot, -1),
])

// :: Number -> Board -> Field -> bool
const isWin = R.curry((winningLength, board, lastPlacement) => R.compose(
  w => !!w,
  findWinningSequence(R.identity, winningLength),
  eligibleSeqsForPlacement(winningLength, lastPlacement),
)(board))

// Number, Number -> [[NEUTRAL]]
const Board = (rows, slots) => R.times(() => R.repeat(NEUTRAL, slots), rows)

// :: Board -> [Number]
const freeSlots = R.compose(
  R.map(R.nth(0)),
  R.filter(p => isNeutral(p[1])),
  F.mapIndexed((v, i) => R.pair(i, v)),
  R.nth(0),
)

// :: Board -> bool
const hasFreeSlots = R.compose(
  ns => ns.length > 0,
  R.filter(isNeutral),
  R.nth(0),
)

// :: Field, Board -> Board
const place = (Field, board) => R.compose(
  R.set(R.lensPath([Field.row, Field.slot]), Field.value),
  R.clone,
)(board)

// :: any, Number, Board -> Board
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

// :: Board -> String
const hash = board => {
  // Implementation optimised for speed
  return [].concat.apply([], board)
    .map(v => v === null ? 0 : v+1)
    .join("")
}

module.exports = {
  Board,
  Field,
  findWin,
  isWin,
  freeSlots,
  hasFreeSlots,
  putIntoSlot,
  hash,
}
