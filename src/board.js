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

const create = (rows, columns) => R.repeat(R.repeat(null, columns), rows)

module.exports = {
  create,
  findWins
}
