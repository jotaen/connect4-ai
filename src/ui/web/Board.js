const React = require("react")

const gridColour = "#294075"

function Container() {
  return (
    <svg viewBox="0 0 100 100">
      <path fillRule="evenodd" fill={gridColour}
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

function Disc({ colour }) {
  return (
    <svg viewBox="0 0 100 100" className="disc">
      <circle cx="50" cy="50" r="50" fill={colour} />
    </svg>
  )
}

module.exports = function Board({ board, colours, onDrop }) {
  const interactiveStyle = {cursor: "pointer"}
  return <div className="board" style={onDrop ? interactiveStyle : null}>
    {board.map((r, i) => r.map((x, slot) => (
      <div
        key={`${i}-${slot}`}
        className="cell"
        style={{borderColor: gridColour}}
        onClick={onDrop ? () => onDrop(slot) : null}
      >
        <Container />
        { x !== null && <Disc colour={colours[x]} /> }
      </div>
    )))}
  </div>
}
