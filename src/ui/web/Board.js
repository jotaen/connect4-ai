const React = require("react")

const gridColor = "#294075"
const discRadius = 45

function Tile() {
  const r = discRadius
  const p = 5 // padding
  return (
    <svg viewBox="0 0 100 100">
      <path fillRule="evenodd" fill={gridColor}
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

function Disc({ color, isWin }) {
  return (
    <svg viewBox="0 0 100 100" className={`disc ${isWin ? "disc-win" : ""}`}>
      <circle cx="50" cy="50" r={discRadius} fill={color} />
    </svg>
  )
}

const isWin = (win, row, slot) => !!win && win.findIndex(fd => fd.row===row && fd.slot===slot) !== -1

module.exports = function Board({ board, colors, onDrop, win }) {
  const canDrop = onDrop !== null
  const interactiveStyle = {cursor: "pointer"}
  return <div className="board" style={canDrop ? interactiveStyle : null}>
    {board.map((xs, row) => xs.map((x, slot) => (
      <div
        key={`${row}-${slot}`}
        className="cell"
        style={{borderColor: gridColor}}
        onClick={canDrop ? () => onDrop(slot) : null}
      >
        { x !== null && <Disc
          color={colors[x]}
          isWin={isWin(win, row, slot)}
        /> }
        <Tile />
        {canDrop && <div
          className="columnmarker"
          style={{top: `-${row*100}%`}}
        ><Disc color={colors[0]} /></div>}
      </div>
    )))}
  </div>
}
