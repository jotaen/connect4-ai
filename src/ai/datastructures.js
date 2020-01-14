const R = require("ramda")
const { putIntoSlot } = require("../board")

const SCORE = {
  WIN: 1,
  LOST: -1,
  DRAW: 0,
  UNKNOWN: null,
}

// :: ([any], Number) -> any
const playerOnTurn = (players, itDepth) => players[itDepth%players.length]

// :: ([any], Number) -> Number
const isMaxOnTurn = (players, itDepth) => itDepth%players.length === 0

// :: (Number, Number, bool) -> NodeResult
const NodeResult = (slot, score, isMax, chance) => ({
  slot,
  score,
  isMax,
  chance,
})

// :: (Config, Number, Board) -> Number -> Node
const Node = (config, itDepth, board) => slot => {
  const player = playerOnTurn(config.players, itDepth)
  const nextState = putIntoSlot(player, slot, board)
  return {
    board: nextState.board,
    field: nextState.field,
    isMax: isMaxOnTurn(config.players, itDepth),
    depth: itDepth,
  }
}

const Config = (opts) => Object.freeze({
  winningLength: opts.winningLength,
  players: opts.players,
  iterationBudget: opts.iterationBudget || 1000,
  random: opts.random || (() => 1),
})

const Stats = () => ({
  iterationCount: 0,
  maxDepth: 0,
})

module.exports = {
  SCORE,
  NodeResult,
  Node,
  Config,
  Stats,
}
