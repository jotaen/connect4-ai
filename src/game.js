const Board = require("./board")

const create = (playerNames, rows, columns) => {
  return {
    players: {
      1: {
        id: 1,
        name: playerNames[0]
      },
      2: {
        id: 2,
        name: playerNames[1]
      }
    },
    columns: columns,
    rows: rows,
    board: Board.create(6, 7)
  }
}

module.exports = {
  create
}
