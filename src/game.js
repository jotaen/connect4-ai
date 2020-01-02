const create = (playerNames) => {
  return {
    players: {
      1: {
        id: 1,
        name: playerNames[0]
      },
      2: {
        id: 2,
        name: playerNames[1]
      }
    }
  }
}

module.exports = {
  create
}
