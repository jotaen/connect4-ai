const Board = require("./board")

const Game = function(playerNames, rows, columns) {
  this._players = {
    1: {
      id: 1,
      name: playerNames[0]
    },
    2: {
      id: 2,
      name: playerNames[1]
    }
  };
  this._board = Board.create(6, 7)
};

Game.prototype.players = function() {
  return Object.values(this._players)
};

Game.prototype.put = function(playerId, colId) {
  const next = Board.next(colId, this._board)
  this._board[next][colId] = playerId
}

Game.prototype.board = function() {
  return this._board
}

module.exports = {
  Game
}
