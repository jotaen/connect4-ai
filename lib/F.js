const R = require("ramda")

// any -> any
const _print = (x) => {
  console.log(x)
  return x
}

// ((any, Number) -> any)
const mapIndexed = R.addIndex(R.map)

// any -> Number -> Number -> [any]
const padListWithValue = R.curry((value, [l, r], xs) => R.unnest([
  R.repeat(value, l),
  xs,
  R.repeat(value, r)
]))

// [any] -> bool
const hasLength = R.curry((l, xs) => R.length(xs) === l)

// [[any]] -> [[any]]
const transposeDiagonal = xxs => R.compose(
  R.map(R.reject(R.isNil)),
  R.transpose,
  R.map(R.apply(padListWithValue(undefined))),
  mapIndexed((xs, i) => [[xxs.length-i-1, i], xs]),
)(xxs)

module.exports = {
  _print, mapIndexed, padListWithValue, transposeDiagonal, hasLength
}
