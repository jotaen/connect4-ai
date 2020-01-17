const React = require("react")

module.exports = function StatusBar({ user, opponent, nextPlayerId }) {
  return (
    <div className="statusbar">
      <div>
        {nextPlayerId === 0 && <div style={{left: 0}} className="statusbar-marker">▶</div>}
        {user.name}
      </div>
      <div>
        {opponent.name}
        {nextPlayerId === 1 && <div style={{right: 0}} className="statusbar-marker">◀</div>}
      </div>
    </div>
  )
}
