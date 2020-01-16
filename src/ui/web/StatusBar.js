const React = require("react")

module.exports = function StatusBar({ players, nextUp }) {
  return <div>
    {players.map((p, i) => {
      const style = {
        textDecoration: nextUp === i ? "underline" : "none"
      }
      return <div key={i} style={style}>
        {p.name}
      </div>
    })}
  </div>
}
