const assert = require("assert")
const game = require("./game")

describe("Game", () => {
  it("has two players with names and subsequent ids", () => {
    const players = ["Sarah", "Martin"]
    const g = game.create(players)
    players.forEach((name, i) => {
      const id = i+1
      const p = g.players[id]
      assert(p)
      assert.strictEqual(p.name, name)
      assert.strictEqual(p.id, id)
    })
  })
})
