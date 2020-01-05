const Board = require("../board")

function Game(players, rows, columns) {
  this._players = players;
  this._nextPlayerIt = 0
  this._board = Board.create(6, 7)
};

Game.prototype.players = function() {
  return this._players
};

Game.prototype.tryPut = function(player, slotId) {
  if (this._players[this._nextPlayerIt].id() !== player.id()) {
    throw "NOT_NEXT"
  }
  const nextBoard = Board.putIntoSlot(player.id(), slotId, this._board)
  if (nextBoard === null) {
    throw "SLOT_IS_FULL"
  }
  this._board = nextBoard
  const isLastPlayer = (this._nextPlayerIt === this._players.length-1)
  this._nextPlayerIt = isLastPlayer ? 0 : this._nextPlayerIt+1
}

Game.prototype.nextPlayer = function() {
  return this._players[this._nextPlayerIt]
}

Game.prototype.board = function() {
  return this._board
}

module.exports = { Game }
