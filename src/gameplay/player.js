function Player(id, name, onTurn) {
  this._id = id
  this._name = name
  this._onTurn = onTurn
}

Player.prototype.id = function() {
  return this._id
}

Player.prototype.name = function() {
  return this._name
}

Player.prototype.onTurn = function(/* passes everything through */) {
  const argsArray = [].slice.call(arguments)
  this._onTurn.apply(null, [this].concat(argsArray))
}

module.exports = { Player }
