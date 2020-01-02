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
