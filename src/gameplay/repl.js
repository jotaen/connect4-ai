const readline = require("readline")
const ai = require("../ai/ai")
const { board2string } = require("../lib/debug")
const { Game } = require("./game")
const { Player } = require("./player")

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const askUser = (me, done) => {
  cli.question("\nChoose slot: ", input => done(parseInt(input)-1))
}

const askAi = (me, done, board, status) => {
  console.log("")
  console.log(me.name() + " is thinking...")
  const config = {
    winningLength: status.winningLength,
    players: status.playerIds.reverse(),
    iterationBudget: 20000,
  }
  const result = ai.move(config, board)
  console.log(result)
  done(result.slot)
}

const cliPlayer = new Player("X", "You", askUser)
const aiPlayer = new Player("O", "Computer", askAi)
const game = new Game([cliPlayer, aiPlayer], 6, 7, 4)

const outputOpts = {
  playerPrepend: {[cliPlayer.id()]: "\x1b[31m", [aiPlayer.id()]: "\x1b[32m"},
  playerAppend: {[cliPlayer.id()]: "\x1b[0m", [aiPlayer.id()]: "\x1b[0m"},
  slotOffset: 1,
}

console.log(`
====== ${game.players().map(p => p.name()+" ("+p.id()+")").join(" vs. ")} ======

Connect ${game.status().winningLength} chips to win.
`)

const repl = () => {
  console.log("")
  console.log(board2string(outputOpts, game.board()))

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
    const boardWithHighlight = game.board()
    s.win.forEach(fd => boardWithHighlight[fd.row][fd.slot] = "♦︎")
    console.log(board2string(outputOpts, boardWithHighlight))
  } else {
    console.log("Game ends with draw")
  }

  console.log("")
  cli.close()
}

repl()
