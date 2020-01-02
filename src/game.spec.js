const assert = require("assert")
const Game = require("./game")

describe("Game", () => {

  const players = ["Sarah", "Martin"]

  it("has two players with names and subsequent ids", () => {
    const g = Game.create(players, 6, 7)
    players.forEach((name, i) => {
      const id = i+1
      const p = g.players[id]
      assert(p)
      assert.strictEqual(p.name, name)
      assert.strictEqual(p.id, id)
    })
  })

  it("has a board that is initialised with empty fields", () => {
    const g = Game.create(players, 6, 7)
    assert.strictEqual(g.columns, 6)
    assert.strictEqual(g.rows, 7)
    assert.strictEqual(g.board.length, 42)
    g.board.forEach(f => {
      assert.strictEqual(f, 0)
    })
  })
})
