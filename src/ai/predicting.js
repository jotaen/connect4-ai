const R = require("ramda")
const F = require("../lib/F")

// :: Board -> [Number] -> [Number]
const prioritiseSlots = board => R.sort(F.compareCloseTo(Math.floor(board[0].length * 0.5)))

module.exports = {
  prioritiseSlots
}
