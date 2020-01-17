const React = require("react")
const { Game, Player } = require("../../game")
const Board = require("./Board")
const InfoBar = require("./InfoBar")

const user = Player(0, "You", "#e82929")
const ai = Player(1, "Computer", "#dfbc34")

const game2state = game => ({
  board: game.board(),
  nextPlayerId: game.nextPlayer() ? game.nextPlayer().id : null,
  isOngoing: game.status().isOngoing,
  win: game.status().win,
  freeSlots: game.status().freeSlots,
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
    if (this._game.nextPlayer() === ai) {
      this.props.worker.postMessage({
        winningLength: this._game.status().winningLength,
        players: [ai.id, user.id],
        board: this._game.board(),
      })
    }
    this.setState(game2state(this._game))
  }

  onAiTurn(result) {
    this._game.tryPut(ai, result.slot)
    this.setState(game2state(this._game))
  }

  render() {
    const canDrop = this.state.nextPlayerId === user.id && this.state.isOngoing
    const colors = {[user.id]: user.symbol, [ai.id]: ai.symbol}
    return <div className="app">
      <Board
        board={this.state.board}
        colors={colors}
        onDrop={canDrop ? this.onUserTurn : null}
        win={this.state.win}
        freeSlots={this.state.freeSlots}
      />
      <InfoBar
        user={user}
        opponent={ai}
        nextPlayerId={this.state.nextPlayerId}
        colors={colors}
        isOngoing={this.state.isOngoing}
        win={this.state.win}
      />
    </div>
  }
}
