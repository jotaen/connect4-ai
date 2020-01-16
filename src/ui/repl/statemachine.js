function* createStateMachine(game) {
  while(game.status().isOngoing) {
    const nextPlayer = game.nextPlayer()
    yield nextPlayer.onTurn(nextPlayer, game.board(), game.status())
      .then(desiredSlot => {
        game.tryPut(nextPlayer, desiredSlot)
      })
  }
  return game.status()
}

module.exports = {
  createStateMachine
}
