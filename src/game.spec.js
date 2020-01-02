const assert = require("assert")
const {Game} = require("./game")

const defaultGame = () => new Game(["Sarah", "Martin"], 6, 7)
const X = null

describe("Game", () => {
  describe("initialisation", () => {
    it("has players with names and subsequent ids", () => {
      const g = defaultGame()
      assert.strictEqual(g.players().length, 2)

      const names = g.players().map(p => p.name)
      assert.deepStrictEqual(names, ["Sarah", "Martin"])

      const ids = g.players().map(p => p.id)
      assert.deepStrictEqual(ids, [0, 1])
    })

    it("has an empty board", () => {
      const g = defaultGame()
      assert.deepStrictEqual(g.board(), [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
      ])
    })
  })

  describe("turns", () => {
    it("returns the id of the next player (round robin)", () => {
      const g = defaultGame()
      assert.strictEqual(g.nextPlayer(), 0)
      g.put(0, 4)
      assert.strictEqual(g.nextPlayer(), 1)
      g.put(1, 4)
      assert.strictEqual(g.nextPlayer(), 0)
      g.put(0, 3)
      assert.strictEqual(g.nextPlayer(), 1)
    })

    it("is possible to put “chips” into columns", () => {
      const g = defaultGame()
      g.put(g.nextPlayer(), 0)
      assert.deepStrictEqual(g.board(), [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [0,X,X,X,X,X,X],
      ])
      g.put(g.nextPlayer(), 0)
      assert.deepStrictEqual(g.board(), [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [1,X,X,X,X,X,X],
        [0,X,X,X,X,X,X],
      ])
      g.put(g.nextPlayer(), 5)
      assert.deepStrictEqual(g.board(), [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [1,X,X,X,X,X,X],
        [0,X,X,X,X,0,X],
      ])
    })
  })
})
