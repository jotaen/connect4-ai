const { putIntoSlot, Board, freeSlots, findWin } = require("./board")

const Player = (id, name, symbol) => ({
  id,
  name,
  symbol,
})

function Game(players, rows, slots, winningLength) {
  this._players = players;
  this._nextPlayerIt = 0
  this._winningLength = winningLength
  this._board = Board(rows, slots)
};

Game.prototype.players = function() {
  return this._players
};

Game.prototype.tryPut = function(player, slotId) {
  if (this._players[this._nextPlayerIt].id !== player.id) {
    throw "NOT_NEXT"
  }
  if (!Number.isInteger(slotId) || slotId < 0 || slotId > this._board[0].length-1) {
    throw "INVALID_SLOT"
  }
  const nextState = putIntoSlot(player.id, slotId, this._board)
  if (nextState === null) {
    throw "SLOT_IS_FULL"
  }
  this._board = nextState.board
  const isLastPlayer = (this._nextPlayerIt === this._players.length-1)
  this._nextPlayerIt = isLastPlayer ? 0 : this._nextPlayerIt+1
}

Game.prototype.status = function() {
  const slots = freeSlots(this._board)
  const win = findWin(this._winningLength, this._board)
  return {
    freeSlots: slots,
    isOngoing: slots.length > 0 && !win,
    win: win,
    winningLength: this._winningLength,
    playerIds: this._players.map(p => p.id)
  }
}

Game.prototype.nextPlayer = function() {
  return this._players[this._nextPlayerIt]
}

Game.prototype.board = function() {
  return this._board
}

module.exports = { Game, Player }
