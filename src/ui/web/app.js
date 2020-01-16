const React = require("react")
const { Game, Player } = require("../../game")
const Board = require("./Board")
const StatusBar = require("./StatusBar")

module.exports = function App() {
  const webPlayer = Player(0, "Hansi", "red")
  const aiPlayer = Player(1, "Computer", "blue")
  const game = new Game([webPlayer, aiPlayer], 6, 7, 4)
  return <div className="app">
    <Board board={game.board()} />
    <StatusBar players={[webPlayer, aiPlayer]} nextUp={0} />
  </div>
}
