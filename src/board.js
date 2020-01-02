const R = require("ramda")
const F = require("../lib/F")

const winningSequence = R.compose(
  R.unnest,
  R.filter(xs => xs.length === 1 && xs[0] !== 0 ? xs[0] : false),
  R.map(R.uniq),
  R.aperture(4),
)

const horizontalWins = R.compose(
  R.reject(R.isEmpty),
  R.map(winningSequence),
)

const verticalWins = R.compose(
  horizontalWins,
  R.transpose,
)

const diagonalDownWins = R.compose(
  horizontalWins,
  F.transposeDiagonal(4),
)

const diagonalUpWins = R.compose(
  diagonalDownWins,
  R.reverse,
)

const hasWon = board => R.compose(
  xs => xs[0] || null,
  F.assert(xs => xs.length <= 1, "Illegal state: multiple wins"),
  R.flatten,
  b => [horizontalWins(b), verticalWins(b), diagonalDownWins(b), diagonalUpWins(b)]
)(board)

module.exports = {
  hasWon
}