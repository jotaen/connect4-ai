const R = require("ramda")
const F = require("../lib/F")

const containsWinningSequence = R.compose(
  R.filter(xs => xs.length === 1 && xs[0] !== 0 ? xs[0] : false),
  R.map(R.uniq),
  R.aperture(4),
)

const horizontalWins = R.compose(
  R.flatten,
  R.map(containsWinningSequence),
)

const hasWon = board => R.compose(
  xs => xs[0] || null,
  F.assert(xs => xs.length <= 1, "Illegal state: multiple wins"),
  R.flatten,
  b => [horizontalWins(b)]
)(board)

module.exports = {
  hasWon
}
