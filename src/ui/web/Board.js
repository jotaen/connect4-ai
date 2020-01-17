const React = require("react")

const gridColour = "#294075"

function Container() {
  return (
    <svg viewBox="0 0 100 100">
      <path fillRule="evenodd" fill={gridColour}
        d="
        M -10 -10 H 110 V 110 H -10 L -10 -10
        M 50, 50
        m -50, 0
        a 50,50 0 1,0 100,0
        a 50,50 0 1,0 -100,0
        "
      />
    </svg>
  )
}

function Disc({ colour, isWin }) {
  return (
    <svg viewBox="0 0 100 100" className="disc">
      <circle cx="50" cy="50" r="50" fill={colour} />
      {isWin && <circle cx="50" cy="50" r="10" fill="black" />}
    </svg>
  )
}

const isWin = (win, row, slot) => !!win && win.findIndex(fd => fd.row===row && fd.slot===slot) !== -1

module.exports = function Board({ board, colours, onDrop, win }) {
  const interactiveStyle = {cursor: "pointer"}
  return <div className="board" style={onDrop ? interactiveStyle : null}>
    {board.map((xs, row) => xs.map((x, slot) => (
      <div
        key={`${row}-${slot}`}
        className="cell"
        style={{borderColor: gridColour}}
        onClick={onDrop ? () => onDrop(slot) : null}
      >
        <Container />
        { x !== null && <Disc
          colour={colours[x]}
          isWin={isWin(win, row, slot)}
        /> }
      </div>
    )))}
  </div>
}
