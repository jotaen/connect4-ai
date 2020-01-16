const R = require("ramda")
const F = require("./F")

// any -> any
const _print = F.peek(console.log)

// [[any]] -> String
const board2string = (options, board) => {
  const opts = Object.assign({
    playerSymbols: {},
    slotOffset: 0,
  }, options)
  return R.compose(
    R.join("\n"),
    R.prepend(" —" + R.repeat("—", board[0].length).join("+") + "— "),
    R.append("  " + R.range(0+opts.slotOffset, board[0].length+opts.slotOffset).join(" ") + " "),
    R.append(" —" + R.repeat("—", board[0].length).join("+") + "— "),
    R.map(r => "| " + r + " |"),
    R.map(R.join(" ")),
    R.map(R.map(x => opts.playerSymbols[x] || x )),
    R.map(R.map(x => x === null ? " " : x)),
  )(board)
}

module.exports = {
  board2string,
  _print,
}
