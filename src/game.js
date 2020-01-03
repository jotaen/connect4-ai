const Board = require("./board")

function Game(playerIds, rows, columns) {
  this._playerIds = playerIds;
  this._nextPlayerId = this._playerIds[0]
  this._board = Board.create(6, 7)
};

Game.prototype.players = function() {
  return this._playerIds
};

Game.prototype.tryPut = function(playerId, slotId) {
  if (this._nextPlayerId !== playerId) {
    throw "NOT_NEXT"
  }
  const nextBoard = Board.putIntoSlot(playerId, slotId, this._board)
  if (nextBoard === null) {
    throw "SLOT_IS_FULL"
  }
  this._board = nextBoard
  const isLastPlayer = (this._nextPlayerId === this._playerIds[this._playerIds.length-1])
  this._nextPlayerId = isLastPlayer ? this._playerIds[0] : this._nextPlayerId + 1
}

Game.prototype.nextPlayer = function() {
  return this._nextPlayerId
}

Game.prototype.board = function() {
  return this._board
}

module.exports = { Game }
