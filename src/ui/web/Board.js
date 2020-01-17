const React = require("react")

const gridColour = "#294075"
const discRadius = 45

function Container() {
  const r = discRadius
  const p = 5 // padding
  return (
    <svg viewBox="0 0 100 100">
      <path fillRule="evenodd" fill={gridColour}
        d={`
          M -10 -10 H 110 V 110 H -10 L -10 -10
          M ${r}, ${r}
          m -${r-p}, ${p}
          a ${r},${r} 0 1,0 ${r*2},0
          a ${r},${r} 0 1,0 -${r*2},0
        `}
      />
    </svg>
  )
}

function Disc({ colour, isWin }) {
  return (
    <svg viewBox="0 0 100 100" className="disc">
      <circle cx="50" cy="50" r={discRadius} fill={colour} />
      {isWin && <circle cx="50" cy="50" r="10" fill="black" />}
    </svg>
  )
}

const isWin = (win, row, slot) => !!win && win.findIndex(fd => fd.row===row && fd.slot===slot) !== -1

module.exports = function Board({ board, colours, onDrop, win }) {
  const canDrop = onDrop !== null
  const interactiveStyle = {cursor: "pointer"}
  return <div className="board" style={canDrop ? interactiveStyle : null}>
    {board.map((xs, row) => xs.map((x, slot) => (
      <div
        key={`${row}-${slot}`}
        className="cell"
        style={{borderColor: gridColour}}
        onClick={canDrop ? () => onDrop(slot) : null}
      >
          { x !== null && <Disc
            colour={colours[x]}
            isWin={isWin(win, row, slot)}
          /> }
        <Container />
        {canDrop && <div className="columnmarker" style={{top: `-${row*100}%`}}>▼</div>}
      </div>
    )))}
  </div>
}
