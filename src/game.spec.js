const assert = require("assert")
const game = require("./game")

describe("Game", () => {
  it("can be created", () => {
    const g = game.create()
    assert(g)
  })
})
