const assert = require("assert")
const {create} = require("./game")

describe("Game", () => {

  const createDefaultGame = () => {
    return create(["Sarah", "Martin"], 6, 7)
  }

  describe("initialisation", () => {
    it("has two players with names and subsequent ids", () => {
      const g = createDefaultGame()
      ;["Sarah", "Martin"].forEach((name, i) => {
        const id = i+1
        const p = g.players[id]
        assert(p)
        assert.strictEqual(p.name, name)
        assert.strictEqual(p.id, id)
      })
    })
  })
})
