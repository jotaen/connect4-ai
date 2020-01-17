const React = require("react")

const gridColor = "#294075"
const discRadius = 45

function Tile() {
  const r = discRadius
  const p = 5 // padding
  return (
    <svg className="tile" viewBox="0 0 100 100">
      <path fill={gridColor}
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
  const classes = `disc ${isWin ? "disc-win" : ""}`
  return (
    <svg viewBox="0 0 100 100" className={classes}>
      <circle cx="50" cy="50" r={discRadius} fill={color} />
    </svg>
  )
}

const isWin = (win, row, slot) => !!win && win.findIndex(fd => fd.row===row && fd.slot===slot) !== -1

module.exports = function Board({ board, colors, onDrop, win, freeSlots }) {
  return <div className="board">
    {board.map((xs, row) => xs.map((x, slot) => {
      const canDrop = onDrop !== null && freeSlots.includes(slot)
      return <div
        key={`${row}-${slot}`}
        className="cell"
        style={{borderColor: gridColor, cursor: canDrop ? "pointer" : "default"}}
        onClick={canDrop ? () => onDrop(slot) : null}
      >
        <Tile />
        { x !== null && <div style={{top: `-${row*100+100}%`}} className="disc-container"><Disc
          color={colors[x]}
          isWin={isWin(win, row, slot)}
        /></div> }
        {canDrop && <div
          className="columnmarker"
          style={{top: `-${row*100}%`}}
        ><Disc color={colors[0]} /></div>}
      </div>
    }))}
  </div>
}
