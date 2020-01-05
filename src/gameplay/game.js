const { putIntoSlot, create, freeSlots } = require("../board")

function Game(players, rows, columns) {
  this._players = players;
  this._nextPlayerIt = 0
  this._board = create(6, 7)
};

Game.prototype.players = function() {
  return this._players
};

Game.prototype.tryPut = function(player, slotId) {
  if (this._players[this._nextPlayerIt].id() !== player.id()) {
    throw "NOT_NEXT"
  }
  if (typeof slotId !== "number" || slotId > this._board[0].length) {
    throw "INVALID_SLOT"
  }
  const nextBoard = putIntoSlot(player.id(), slotId, this._board)
  if (nextBoard === null) {
    throw "SLOT_IS_FULL"
  }
  this._board = nextBoard
  const isLastPlayer = (this._nextPlayerIt === this._players.length-1)
  this._nextPlayerIt = isLastPlayer ? 0 : this._nextPlayerIt+1
}

Game.prototype.next = function() {
  const nextPlayer = this._players[this._nextPlayerIt]
  return new Promise((resolve, reject) => {
    nextPlayer.onTurn(this._board, freeSlots(this._board), resolve)
  }).then(desiredSlot => {
    this.tryPut(nextPlayer, desiredSlot)
  })
}

Game.prototype.nextPlayer = function() {
  return this._players[this._nextPlayerIt]
}

Game.prototype.board = function() {
  return this._board
}

module.exports = { Game }
