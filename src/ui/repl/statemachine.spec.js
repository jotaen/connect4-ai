const assert = require("assert")
const { Game, Player } = require("../../game")
const { createStateMachine } = require("./statemachine")

const X = null

const defaultGame = (args = {}) => {
  const players = args.players
  const rows = args.rows || 6
  const slots = args.slots || 7
  const winningLength = args.winningLength || 4
  return new Game(players, rows, slots, winningLength)
}

describe("statemachine", () => {
  it("passes on game status to the callback", testDone => {
    const p1 = Player(1, "Bill")
    p1.onTurn = (me, board, status) => {
      assert.strictEqual(status.winningLength, 4)
      assert.deepStrictEqual(status.playerIds, [1])
      return new Promise(r => r(1))
    }
    const g = defaultGame({ players: [p1] })
    const sm = createStateMachine(g)
    sm.next().value
      .then(testDone)
      .catch(console.log)
  })

  it("always invokes the player on turn", testDone => {
    let spy1 = 0
    let spy2 = 0
    const p1 = Player(1, "Bill")
    p1.onTurn = (me, board, status) => {
      spy1++
      return new Promise(r => r(status.freeSlots[1]))
    }
    const p2 = Player(2, "Carla")
    p2.onTurn = (me, board, status) => {
      spy2++
      return new Promise(r => r(status.freeSlots[4]))
    }
    const g = defaultGame({ players: [p1, p2] })
    const sm = createStateMachine(g)

    sm.next().value.then(() => {
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
    .then(() => sm.next())
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
    .then(() => sm.next())
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
