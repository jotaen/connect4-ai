const assert = require("assert")
const { Game } = require("./game")
const { Player } = require("./player")

const player1 = Object.freeze(new Player(1))
const player2 = Object.freeze(new Player(2))
const defaultGame = (players = [player1, player2]) => new Game(players, 6, 7)
const X = null

describe("Game", () => {
  describe("initialisation", () => {
    it("has players", () => {
      const g = defaultGame()
      assert.deepStrictEqual(g.players().map(p => p.id()), [1, 2])
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
      let nextPlayer

      nextPlayer = g.nextPlayer()
      assert.strictEqual(nextPlayer.id(), 1)
      g.tryPut(nextPlayer, 4)
      nextPlayer = g.nextPlayer()
      assert.strictEqual(nextPlayer.id(), 2)
      g.tryPut(nextPlayer, 4)
      nextPlayer = g.nextPlayer()
      assert.strictEqual(nextPlayer.id(), 1)
      g.tryPut(nextPlayer, 3)
      nextPlayer = g.nextPlayer()
      assert.strictEqual(nextPlayer.id(), 2)
    })

    it("fails if player is not next", () => {
      const g = defaultGame()

      assert.doesNotThrow(() => g.tryPut(player1, 4))
      assert.throws(() => g.tryPut(player1, 4), e => e === "NOT_NEXT")
      assert.doesNotThrow(() => g.tryPut(player2, 4))
      assert.throws(() => g.tryPut(player2, 4), e => e === "NOT_NEXT")
    })

    it("fails if slot is full", () => {
      const g = defaultGame()

      g.tryPut(player1, 4)
      g.tryPut(player2, 4)
      g.tryPut(player1, 4)
      g.tryPut(player2, 4)
      g.tryPut(player1, 4)
      g.tryPut(player2, 4)
      assert.throws(() => g.tryPut(player1, 4), e => e === "SLOT_IS_FULL")
    })

    it("fails player is not part of game", () => {
      const g = defaultGame()

      const evil = new Player(5, "Evil", () => 2)
      assert.throws(() => g.tryPut(evil, 4), e => e === "NOT_NEXT")
    })

    it("fails if slot is invalid", () => {
      const g = defaultGame()

      assert.throws(() => g.tryPut(player1, 18), e => e === "INVALID_SLOT")
      assert.throws(() => g.tryPut(player1, "asdf"), e => e === "INVALID_SLOT")
      assert.throws(() => g.tryPut(player1, undefined), e => e === "INVALID_SLOT")
      assert.throws(() => g.tryPut(player1, [3]), e => e === "INVALID_SLOT")
    })

    it("is possible to put “chips” into slots", () => {
      const g = defaultGame()
      g.tryPut(g.nextPlayer(), 0)
      assert.deepStrictEqual(g.board(), [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [1,X,X,X,X,X,X],
      ])
      g.tryPut(g.nextPlayer(), 0)
      assert.deepStrictEqual(g.board(), [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [2,X,X,X,X,X,X],
        [1,X,X,X,X,X,X],
      ])
      g.tryPut(g.nextPlayer(), 5)
      assert.deepStrictEqual(g.board(), [
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [X,X,X,X,X,X,X],
        [2,X,X,X,X,X,X],
        [1,X,X,X,X,1,X],
      ])
    })

    it("is not possible to overfill slots", () => {
      const g = defaultGame()
      g.tryPut(g.nextPlayer(), 0)
      g.tryPut(g.nextPlayer(), 0)
      g.tryPut(g.nextPlayer(), 0)
      g.tryPut(g.nextPlayer(), 0)
      g.tryPut(g.nextPlayer(), 0)
      g.tryPut(g.nextPlayer(), 0)
      assert.throws(() => g.tryPut(g.nextPlayer(), 0))
    })
  })

  describe("next", () => {
    it("always invokes the player on turn", testDone => {
      let spy1 = 0
      let spy2 = 0
      const p1 = new Player(1, "Bill", (board, freeSlots, done) => {
        spy1++
        done(freeSlots[1])
      })
      const p2 = new Player(2, "Carla", (board, freeSlots, done) => {
        spy2++
        done(freeSlots[4])
      })
      const g = defaultGame([p1, p2])

      g.next().then(() => {
        assert.strictEqual(spy1, 1)
        assert.strictEqual(spy2, 0)
        assert.deepStrictEqual(g.board(), [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,1,X,X,X,X,X],
        ])
      })
      .then(() => g.next())
      .then(() => {
        assert.strictEqual(spy1, 1)
        assert.strictEqual(spy2, 1)
        assert.deepStrictEqual(g.board(), [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,1,X,X,2,X,X],
        ])
      })
      .then(() => g.next())
      .then(() => {
        assert.strictEqual(spy1, 2)
        assert.strictEqual(spy2, 1)
        assert.deepStrictEqual(g.board(), [
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,X,X,X,X,X,X],
          [X,1,X,X,X,X,X],
          [X,1,X,X,2,X,X],
        ])
      })
      .then(testDone)
      .catch(console.log)
    })
  })
})
