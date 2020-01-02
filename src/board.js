const R = require('ramda')

const print = x => {
  console.log(x)
  return x
}

const containsWinningSequence = R.compose(
  R.filter(xs => xs.length === 1 && xs[0] !== 0 ? xs[0] : false),
  R.map(R.uniq),
  R.aperture(4),
)

const fail = msg => {throw msg;}

const hasWonHorizontally = R.compose(
  xs => xs[0] || null,
  xs => xs.length === 2 ? fail("Illegal state") : xs,
  R.flatten,
  R.map(containsWinningSequence),
)

const hasWon = (board) => {
  return hasWonHorizontally(board)
}

module.exports = {
  hasWon
}
