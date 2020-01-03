function Table(playerNames) {
  this._players = playerNames.map((n, i) => ({
    id: i,
    name: n,
  }))
}

Table.prototype.players = function() {
  return this._players
}

module.exports = { Table }
