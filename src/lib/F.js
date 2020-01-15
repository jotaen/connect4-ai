const R = require("ramda")

// :: ((a, Number) -> a)
const mapIndexed = R.addIndex(R.map)

// :: a -> Number -> Number -> [a]
const padListWithValue = R.curry((value, [l, r], xs) => R.unnest([
  R.repeat(value, l),
  xs,
  R.repeat(value, r)
]))

// :: (x -> any) -> a -> a
const peek = R.curry((fn, x) => {
  fn(x)
  return x
})

// :: [a] -> bool
const hasLength = R.curry((l, xs) => R.length(xs) === l)

// :: (a -> Number) -> (a, a) -> a
const maxBy = fn => (x, y) => fn(x) > fn(y) ? x : y

// :: (a -> Number) -> (a, a) -> a
const minBy = fn => (x, y) => fn(x) < fn(y) ? x : y

// :: [[a]] -> [[a]]
const transposeDiagonal = xxs => R.compose(
  R.map(R.reject(R.isNil)),
  R.transpose,
  R.map(R.apply(padListWithValue(undefined))),
  mapIndexed((xs, i) => [[xxs.length-i-1, i], xs]),
)(xxs)

// :: Number -> ((Number, Number) -> Number) -> [Number]
const compareCloseTo = pivot => (a, b) => (Math.abs(a - pivot) - Math.abs(b - pivot) || b - a)

const mapIterateUntil = (predicate, fn) => xs => {
  let loopCount = 0
  for (let i=0; predicate(xs); i++) {
    const index = i%xs.length
    if (index === 0) {
      loopCount++
    }
    xs[index] = fn(xs[index], loopCount)
  }
  return xs
}

module.exports = {
  mapIndexed,
  transposeDiagonal,
  hasLength,
  peek,
  maxBy,
  minBy,
  compareCloseTo,
  mapIterateUntil,
}
