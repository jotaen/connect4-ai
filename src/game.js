const Board = require("./board")

function Game(playerIds, rows, columns) {
  this._playerIds = playerIds;
  this._nextPlayerId = this._playerIds[0]
  this._board = Board.create(6, 7)
};

Game.prototype.players = function() {
  return this._playerIds
};

Game.prototype.put = function(playerId, colId) {
  const nextRow = Board.next(colId, this._board)
  this._board[nextRow][colId] = playerId
  this._nextPlayerId = (this._nextPlayerId === this._playerIds[this._playerIds.length-1]) ?
    this._playerIds[0] : this._nextPlayerId + 1
}

Game.prototype.nextPlayer = function() {
  return this._nextPlayerId
}

Game.prototype.board = function() {
  return this._board
}

module.exports = { Game }
