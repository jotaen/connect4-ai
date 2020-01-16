const readline = require("readline")
const ai = require("../../ai/ai")
const { board2string } = require("../../lib/debug")
const { Game, Player } = require("../../game")
const { createStateMachine } = require("./statemachine")

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const cliPlayer = Player(0, "You", "X")
cliPlayer.onTurn = (me) => {
  return new Promise(r => cli.question("\nChoose slot: ", input => r(parseInt(input)-1)))
}

const aiPlayer = Player(1, "Computer", "O")
aiPlayer.onTurn = (me, board, status) => {
  console.log("")
  console.log(me.name + " is thinking...")
  const config = {
    winningLength: status.winningLength,
    players: status.playerIds.reverse(),
    iterationBudget: 15000,
    random: () => Math.random(),
  }
  const result = ai.move(config, board)
  console.log(result)
  return new Promise(r => r(result.slot))
}

const game = new Game([cliPlayer, aiPlayer], 6, 7, 4)
const stateMachine = createStateMachine(game)

const outputOpts = {
  playerSymbols: {
    [cliPlayer.id]: `\x1b[31m${cliPlayer.symbol}\x1b[0m`,
    [aiPlayer.id]: `\x1b[32m${aiPlayer.symbol}\x1b[0m`},
  slotOffset: 1,
}

console.log(`
====== ${game.players().map(p => p.name+" ("+p.symbol+")").join(" vs. ")} ======

Connect ${game.status().winningLength} chips to win.
`)

const repl = () => {
  console.log("")
  console.log(board2string(outputOpts, game.board()))

  const state = stateMachine.next()

  if (!state.done) {
    return state.value
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

  const win = state.value.win
  if (win) {
    const winner = game.players().find(p => p.id === win[0].value)
    console.log("Winner: " + winner.name)
    const boardWithHighlight = game.board()
    win.forEach(fd => boardWithHighlight[fd.row][fd.slot] = "♦︎")
    console.log(board2string(outputOpts, boardWithHighlight))
  } else {
    console.log("Game ends with draw")
  }

  console.log("")
  cli.close()
}

repl()
