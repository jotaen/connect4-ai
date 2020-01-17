const React = require("react")
const { Game, Player } = require("../../game")
const Board = require("./Board")
const { ControlBar, PlayerBar, StatusBar } = require("./Bars")

const user = Player(0, "You", "#e82929")
const ai = Player(1, "Computer", "#f2c000")

const game2state = game => ({
  board: game.board(),
  nextPlayerId: game.nextPlayer() ? game.nextPlayer().id : null,
  isOngoing: game.status().isOngoing,
  win: game.status().win,
  freeSlots: game.status().freeSlots,
})

const stdGame = () => new Game([user, ai], 6, 7, 4)

module.exports = class App extends React.Component {
  constructor(props) {
    super(props)
    this.putForUser = this.putForUser.bind(this)
    this.putForAi = this.putForAi.bind(this)
    this.triggerAi = this.triggerAi.bind(this)
    this.changeDifficulty = this.changeDifficulty.bind(this)
    this.startNewGame = this.startNewGame.bind(this)

    this.props.worker.onmessage = e => this.putForAi(e.data)
    this._game = stdGame()
    this.state = {
      difficulty: "EASY",
      ...game2state(this._game),
    }
  }

  putForUser(slot) {
    this._game.tryPut(user, slot)
    this.setState(game2state(this._game))
    this.triggerAi()
  }

  triggerAi() {
    if (this._game.nextPlayer() !== ai) {
      return
    }
    this.props.worker.postMessage({
      winningLength: this._game.status().winningLength,
      players: [ai.id, user.id],
      board: this._game.board(),
      iterationBudget: {
        "EASY": 3000,
        "MEDIUM": 9000,
        "HARD": 15000,
      }[this.state.difficulty]
    })
  }

  putForAi(result) {
    this._game.tryPut(ai, result.slot)
    this.setState(game2state(this._game))
  }

  changeDifficulty(e) {
    this.setState({difficulty: e.target.value})
  }

  startNewGame() {
    this.props.worker.terminate()
    this._game = stdGame()
    this.setState(game2state(this._game))
  }

  render() {
    const canDrop = this.state.nextPlayerId === user.id && this.state.isOngoing
    const colors = {[user.id]: user.symbol, [ai.id]: ai.symbol}
    return <div className="app">
      <Board
        board={this.state.board}
        colors={colors}
        onDrop={canDrop ? this.putForUser : null}
        win={this.state.win}
        freeSlots={this.state.freeSlots}
      />
      <ControlBar
        onSetDifficulty={canDrop ? this.changeDifficulty : null}
        onNewGame={this.startNewGame}
        difficulty={this.state.difficulty}
      />
      <PlayerBar
        user={user}
        opponent={ai}
        nextPlayerId={this.state.nextPlayerId}
        colors={colors}
      />
      <StatusBar
        nextPlayerId={this.state.nextPlayerId}
        isOngoing={this.state.isOngoing}
        win={this.state.win}
      />
    </div>
  }
}
