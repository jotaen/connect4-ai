const assert = require("assert")
const { Game } = require("./game")
const { Player } = require("./player")
const Fd = require("../board").Field

const X = null

const defaultGame = (args = {}) => {
  const players = args.players || [new Player(1), new Player(2)]
  const rows = args.rows || 6
  const slots = args.slots || 7
  const winningLength = args.winningLength || 4
  return new Game(players, rows, slots, winningLength)
}

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


    it("the board size can be supplied", () => {
      const g = new Game([], 4, 3)
      assert.deepStrictEqual(g.board(), [
        [X,X,X],
        [X,X,X],
        [X,X,X],
        [X,X,X],
      ])
    })
  })

  describe("status", () => {
    it("reports on game status", () => {
      const g = defaultGame({winningLength: 3})
      assert.strictEqual(g.status().isOngoing, true)
      assert.strictEqual(g.status().win, null)
      g.tryPut(g.nextPlayer(), 1)
      g.tryPut(g.nextPlayer(), 2)
      g.tryPut(g.nextPlayer(), 1)
      g.tryPut(g.nextPlayer(), 2)
      assert.strictEqual(g.status().isOngoing, true)
      g.tryPut(g.nextPlayer(), 1)
      assert.strictEqual(g.status().isOngoing, false)
      assert.deepStrictEqual(g.status().win, [Fd(3,1,1), Fd(4,1,1), Fd(5,1,1)])
    })

    it("reports playable slots", () => {
      const g = defaultGame()
      assert.deepStrictEqual(g.status().freeSlots, [0, 1, 2, 3, 4, 5, 6])
    })

    it("passes player ids", () => {
      const g = defaultGame()
      assert.deepStrictEqual(g.status().playerIds, [1, 2])
    })

    it("states the configured winningLength", () => {
      const g = defaultGame()
      assert.deepStrictEqual(g.status().winningLength, 4)
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

      assert.doesNotThrow(() => g.tryPut(g.players()[0], 4))
      assert.throws(() => g.tryPut(g.players()[0], 4), e => e === "NOT_NEXT")
      assert.doesNotThrow(() => g.tryPut(g.players()[1], 4))
      assert.throws(() => g.tryPut(g.players()[1], 4), e => e === "NOT_NEXT")
    })

    it("fails if slot is full", () => {
      const g = defaultGame()

      g.tryPut(g.players()[0], 4)
      g.tryPut(g.players()[1], 4)
      g.tryPut(g.players()[0], 4)
      g.tryPut(g.players()[1], 4)
      g.tryPut(g.players()[0], 4)
      g.tryPut(g.players()[1], 4)
      assert.throws(() => g.tryPut(g.players()[0], 4), e => e === "SLOT_IS_FULL")
    })

    it("fails player is not part of game", () => {
      const g = defaultGame()

      const evil = new Player(5, "Evil", () => 2)
      assert.throws(() => g.tryPut(evil, 4), e => e === "NOT_NEXT")
    })

    it("fails if slot is invalid", () => {
      const g = defaultGame()

      assert.throws(() => g.tryPut(g.players()[0], -12), e => e === "INVALID_SLOT")
      assert.throws(() => g.tryPut(g.players()[0], 18), e => e === "INVALID_SLOT")
      assert.throws(() => g.tryPut(g.players()[0], "asdf"), e => e === "INVALID_SLOT")
      assert.throws(() => g.tryPut(g.players()[0], undefined), e => e === "INVALID_SLOT")
      assert.throws(() => g.tryPut(g.players()[0], [3]), e => e === "INVALID_SLOT")
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
    it("passes on game status to the callback", testDone => {
      const p1 = new Player(1, "Bill", (done, board, status) => {
        assert.strictEqual(status.winningLength, 4)
        assert.deepStrictEqual(status.playerIds, [1])
        done(2)
      })
      const g = defaultGame({ players: [p1] })
      g.next()
        .then(testDone)
        .catch(console.log)
    })

    it("always invokes the player on turn", testDone => {
      let spy1 = 0
      let spy2 = 0
      const p1 = new Player(1, "Bill", (done, board, status) => {
        spy1++
        done(status.freeSlots[1])
      })
      const p2 = new Player(2, "Carla", (done, board, status) => {
        spy2++
        done(status.freeSlots[4])
      })
      const g = defaultGame({ players: [p1, p2] })

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
