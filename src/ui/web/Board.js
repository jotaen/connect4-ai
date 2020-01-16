const React = require("react")

const gridColour = "#294075"

function Container() {
  return (
    <svg viewBox="0 0 100 100">
      <path fill-rule="evenodd" fill={gridColour}
        d="
        M -1 -1 H 102 V 102 H -1 L -1 -1
        M 50, 50
        m -50, 0
        a 50,50 0 1,0 100,0
        a 50,50 0 1,0 -100,0
        "
      />
    </svg>
  )
}

function Disc() {
  return (
    <svg viewBox="0 0 100 100" className="disc">
      <circle cx="50" cy="50" r="50" fill="red" />
    </svg>
  )
}

module.exports = function Board({ board }) {
  return <div className="board">
    {board.map(r => r.map(f => (
      <div className="cell" style={{borderColor: gridColour}}>
        <Container />
        { f && <Disc /> }
      </div>
    )))}
  </div>
}
