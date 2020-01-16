const React = require("react")
const { Game, Player } = require("../../game")
const Board = require("./Board")
const StatusBar = require("./StatusBar")

const user = Player(0, "Hansi", "#e82929")
const ai = Player(1, "Computer", "#dfbc34")

const game2state = game => ({
  board: game.board(),
  isUserNext: game.nextPlayer() === user,
  isOngoing: game.status().isOngoing,
  win: game.status().win,
})

module.exports = class App extends React.Component {
  constructor(props) {
    super(props)
    this._game = new Game([user, ai], 6, 7, 4)
    this.state = game2state(this._game)
    this.props.worker.onmessage = e => this.onAiTurn(e.data)
    this.onUserTurn = this.onUserTurn.bind(this)
    this.onAiTurn = this.onAiTurn.bind(this)
  }

  onUserTurn(slot) {
    this._game.tryPut(user, slot)
    this.props.worker.postMessage({
      winningLength: this._game.status().winningLength,
      players: [ai.id, user.id],
      board: this._game.board(),
    })
    this.setState(game2state(this._game))
  }

  onAiTurn(result) {
    this._game.tryPut(ai, result.slot)
    this.setState(game2state(this._game))
  }

  render() {
    const canDrop = this.state.isUserNext && this.state.isOngoing
    return <div className="app">
      <Board
        board={this.state.board}
        colours={{[user.id]: user.symbol, [ai.id]: ai.symbol}}
        onDrop={canDrop ? this.onUserTurn : null}
        win={this.state.win}
      />
      <StatusBar
        user={user}
        opponent={ai}
        isUserNext={this.state.isUserNext}
      />
    </div>
  }
}
