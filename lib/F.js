const R = require("ramda")

module.exports.print = (x) => {
  console.log(x)
  return x
}

module.exports.assert = (predicate, msg) => (x) => {
  if (!predicate(x)) {
    throw new Error(msg)
  }
  return x
}

module.exports.mapIndexed = R.addIndex(R.map)

module.exports.concatAll = R.apply(R.unnest)

const mapIndexed = R.addIndex(R.map);
module.exports.transposeDiagonal = minLength => xxs => R.compose(
  R.filter(xs => xs.length >= minLength),
  R.map(R.reject(x => x === undefined)),
  R.transpose,
  R.map(([l, r, xs]) => R.unnest([R.repeat(undefined, l), xs, R.repeat(undefined, r)])),
  mapIndexed((xs, i) => [xxs.length-i-1, i, xs]),
)(xxs)
