const React = require("react")

module.exports.ControlBar = function ControlBar({ onNewGame, onSetDifficulty, difficulty, difficulties }) {
  return (
    <div className="controllbar">
      <button onClick={onNewGame}>New Game</button>
      <span style={{flex: 1}}></span>
      <select onChange={onSetDifficulty} disabled={onSetDifficulty === null} value={difficulty}>
        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  )
}

module.exports.PlayerBar = function PlayerBar({ user, opponent, nextPlayerId, colors }) {
  return (
    <div className="playerbar">
      <div>
        {nextPlayerId === 0 && <div
          style={{left: 0, color: colors[user.id]}}
          className="playerbar-marker"
        >▶</div>}
        {user.name}
      </div>
      <div>
        {opponent.name}
        {nextPlayerId === 1 && <div
          style={{right: 0, color: colors[opponent.id]}}
          className="playerbar-marker"
        >◀</div>}
      </div>
    </div>
  )
}

const textNextUp = {
  0: "It’s your turn",
  1: "Computer is thinking…",
}

const textWinner = {
  [-1]: "Game ends with draw", 
  0: "Congratulations, you have won!",
  1: "Computer has won!",
}

module.exports.StatusBar = function StatusBar({ nextPlayerId, win, isOngoing }) {
  return (
    <div className="statusbar">
      {isOngoing ? textNextUp[nextPlayerId] : textWinner[win ? win[0].value : -1]}
    </div>
  )
}
