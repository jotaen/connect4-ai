const R = require("ramda")
const F = require("../lib/F")

// [id] -> [id]
const reduceToWinners = winningLength => R.compose(
  R.filter(x => x !== 0),
  R.unnest,
  R.filter(xs => xs.length === 1),
  R.map(R.uniq),
  R.aperture(winningLength),
)

const horizontalSeqs = R.identity
const verticalSeqs = R.transpose
const diagonalDownSeqs = F.transposeDiagonal
const diagonalUpSeqs = R.compose(F.transposeDiagonal, R.reverse)

// Number -> [[id]] -> [id]
const findWinners = R.curry((winningLength, board) => R.compose(
  R.chain(reduceToWinners(winningLength)),
  R.unnest,
  R.juxt([horizontalSeqs, verticalSeqs, diagonalDownSeqs, diagonalUpSeqs]),
)(board))

const create = (rows, columns) => R.repeat(R.repeat(0, columns), rows)

module.exports = {
  create,
  findWinners
}
