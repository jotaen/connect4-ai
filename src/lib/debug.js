const R = require("ramda")
const F = require("./F")

// [[any]] -> String
const board2string = R.compose(
  R.join("\n"),
  R.map(R.join(" ")),
  R.map(R.map(x => x === null ? " " : x)),
)

// any -> any
const _print = F.peek(console.log)

module.exports = {
  board2string,
  _print,
}
