const Board = require("./board")

const Game = function(playerNames, rows, columns) {
  this._players = playerNames.map((n, i) => ({
    id: i,
    name: n,
  }));
  this._nextPlayerId = this._players[0].id
  this._board = Board.create(6, 7)
};

Game.prototype.players = function() {
  return this._players
};

Game.prototype.put = function(playerId, colId) {
  const nextRow = Board.next(colId, this._board)
  this._board[nextRow][colId] = playerId
  this._nextPlayerId = (this._nextPlayerId === this._players.length-1) ?
    this._players[0].id : this._nextPlayerId + 1
}

Game.prototype.nextPlayer = function() {
  return this._nextPlayerId
}

Game.prototype.board = function() {
  return this._board
}

module.exports = {
  Game
}
