const React = require("react")

module.exports = function InfoBar({ user, opponent, nextPlayerId, colors }) {
  return <>
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
    <div className="statusbar">
      {{
        0: "It’s your turn",
        1: "Computer is thinking…",
      }[nextPlayerId]}
    </div>
  </>
}
