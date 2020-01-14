const R = require("ramda")

const randomise = next => R.map(
  nr => {
    if (!nr.chance) {
      return nr
    }
    // TODO
    return nr
  }
)

module.exports = {
  randomise,
}
