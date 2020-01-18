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

function Marker({ color, direction }) {
  const ps = {
    ["RIGHT"]: "0,0 100,50 0,100",
    ["LEFT"]: "100,0 0,50 100,100",
  }
  return <svg viewBox="0 0 100 100">
    <polygon points={ps[direction]} fill={color} />
  </svg>
}

module.exports.PlayerBar = function PlayerBar({ user, opponent, nextPlayerId, colors }) {
  return (
    <div className="playerbar">
      <div>
        {nextPlayerId === 0 && <div
          style={{left: 0}}
          className="playerbar-marker"
        ><Marker color={colors[user.id]} direction={"RIGHT"} /></div>}
        {user.name}
      </div>
      <div>
        {opponent.name}
        {nextPlayerId === 1 && <div
          style={{right: 0}}
          className="playerbar-marker"
        ><Marker color={colors[opponent.id]} direction={"LEFT"} /></div>}
      </div>
    </div>
  )
}

const textNextUp = {
  0: "It’s your turn",
  1: <span>Computer is thinking<Spinner/></span>,
}

const textWinner = {
  [-1]: "Game ends with draw", 
  0: "Congratulations, you have won!",
  1: "Computer has won!",
}

function Spinner() {
  return <span className="spinner"><span>•</span><span>•</span><span>•</span></span>
}

module.exports.StatusBar = function StatusBar({ nextPlayerId, win, isOngoing }) {
  return (
    <div className="statusbar">
      {isOngoing ? textNextUp[nextPlayerId] : textWinner[win ? win[0].value : -1]}
    </div>
  )
}
