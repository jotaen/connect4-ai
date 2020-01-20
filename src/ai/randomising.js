const F = require("../lib/F")

const DISTRIBUTION_FACTOR = 0.5
const CHANCE_THRESHOLD = 1

// :: [NodeResult] -> [NodeResult]
const randomiseChance = next => F.mapIndexed((nr, i) => {
  if (nr.chance < CHANCE_THRESHOLD) {
    nr.chance = undefined
  }
  if (nr.chance === undefined) {
    nr.chance = Math.pow(next(), i+DISTRIBUTION_FACTOR)
  }
  return nr
})

module.exports = {
  randomiseChance,
}
