const R = require("ramda")

// ((any, Number) -> any)
const mapIndexed = R.addIndex(R.map)

// any -> Number -> Number -> [any]
const padListWithValue = R.curry((value, [l, r], xs) => R.unnest([
  R.repeat(value, l),
  xs,
  R.repeat(value, r)
]))

// (x -> *) -> any -> any
const peek = R.curry((fn, x) => {
  fn(x)
  return x
})

// [any] -> bool
const hasLength = R.curry((l, xs) => R.length(xs) === l)

// ([any] -> any) -> [any] -> any
const maxBy = fn => R.compose(R.last, R.sortBy(fn))

// ([any] -> any) -> [any] -> any
const minBy = fn => R.compose(R.head, R.sortBy(fn))

// [[any]] -> [[any]]
const transposeDiagonal = xxs => R.compose(
  R.map(R.reject(R.isNil)),
  R.transpose,
  R.map(R.apply(padListWithValue(undefined))),
  mapIndexed((xs, i) => [[xxs.length-i-1, i], xs]),
)(xxs)

module.exports = {
  mapIndexed,
  transposeDiagonal,
  hasLength,
  peek,
  maxBy,
  minBy,
}
