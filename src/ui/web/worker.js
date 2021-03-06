const { move } = require("../../ai/ai")

onmessage = function(e) {
  const config = {
    winningLength: e.data.winningLength,
    players: e.data.players,
    iterationBudget: e.data.iterationBudget,
    random: () => Math.random(),
  }
  const result = move(config, e.data.board)
  postMessage(result);
}
