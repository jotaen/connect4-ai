const readline = require("readline")
const ai = require("../ai")
const { board2string } = require("../lib/debug")
const { Game } = require("./game")
const { Player } = require("./player")

const SLOT_OFFSET = 1

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const askUser = (me, done) => {
  cli.question("\nChoose slot: ", input => done(parseInt(input)-SLOT_OFFSET))
}

const askAi = (me, done, board, status) => {
  console.log("")
  console.log(me.name() + " is thinking...")
  const config = {
    winningLength: status.winningLength,
    players: status.playerIds.reverse(),
  }
  const result = ai.move(config, board)
  console.log(result)
  done(result.slot)
}

const cliPlayer = new Player("X", "You", askUser)
const aiPlayer = new Player("O", "Computer", askAi)
const game = new Game([cliPlayer, aiPlayer], 4, 5, 3)

console.log(`
====== ${game.players().map(p => p.name()+" ("+p.id()+")").join(" vs. ")} ======

Connect ${game.status().winningLength} chips to win.
`)

const repl = () => {
  console.log("")
  console.log(board2string(SLOT_OFFSET, game.board()))

  const s = game.status()

  if (s.isOngoing) {
    return game.next()
      .then(repl)
      .catch(err => {
        const message = {
          SLOT_IS_FULL: "This slot is already filled up",
          INVALID_SLOT: "Invalid input",
        }[err]
        console.log("Error: " + (message || err))
        repl()
      })
  }

  console.log("\n===== GAME FINISHED =====\n")

  if (s.win) {
    const winner = game.players().find(p => p.id() === s.win[0].value)
    console.log("Winner: " + winner.name())
  } else {
    console.log("Game ends with draw")
  }

  console.log("")
  cli.close()
}

repl()
