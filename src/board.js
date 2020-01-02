const R = require("ramda")
const F = require("../lib/F")

const winningSequence = R.compose(
  R.unnest,
  R.filter(xs => xs.length === 1 && xs[0] !== 0 ? xs[0] : false),
  R.map(R.uniq),
  R.aperture(4),
)

const mapIndexed = R.addIndex(R.map);
const transposeDiagonal = xxs => R.compose(
  R.filter(xs => xs.length >= 4),
  R.map(R.reject(x => x === undefined)),
  R.transpose,
  R.map(([l, r, xs]) => R.unnest([R.repeat(undefined, l), xs, R.repeat(undefined, r)])),
  mapIndexed((xs, i) => [xxs.length-i-1, i, xs]),
)(xxs)

const horizontalWins = R.compose(
  R.reject(R.isEmpty),
  R.map(winningSequence),
)

const verticalWins = R.compose(
  R.reject(R.isEmpty),
  R.map(winningSequence),
  R.transpose,
)

const diagonalDownWins = R.compose(
  R.reject(R.isEmpty),
  R.map(winningSequence),
  transposeDiagonal,
)

const diagonalUpWins = R.compose(
  R.reject(R.isEmpty),
  R.map(winningSequence),
  transposeDiagonal,
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
