function Player(id, name) {
  this._id = id
  this._name = name
}

Player.prototype.id = function() {
  return this._id
}

Player.prototype.name = function() {
  return this._name
}

module.exports = { Player }
