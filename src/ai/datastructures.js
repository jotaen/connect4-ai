const R = require("ramda")
const { putIntoSlot } = require("../board")

const SCORE = {
  WIN: 1,
  LOST: -1,
  DRAW: 0,
  UNKNOWN: null,
}

// :: [Number], Number -> any
const playerOnTurn = (players, itDepth) => players[itDepth%players.length]

// :: [Number], Number -> Number
const isMaxOnTurn = (players, itDepth) => itDepth%players.length === 0

// :: Number, Number, bool, Number, Number -> NodeResult
const NodeResult = (slot, score, isMax, chance, depth) => ({
  slot,
  score,
  isMax,
  chance,
  depth,
})

// :: Config, Number, Number, Board -> Number -> Node
const Node = (config, maxDepth, itDepth, board) => slot => {
  const player = playerOnTurn(config.players, itDepth)
  const nextState = putIntoSlot(player, slot, board)
  return {
    board: nextState.board,
    field: nextState.field,
    isMax: isMaxOnTurn(config.players, itDepth),
    depth: itDepth,
    maxDepth: maxDepth,
  }
}

// :: {…} -> Config
const Config = (opts) => Object.freeze({
  winningLength: opts.winningLength,
  players: opts.players,
  iterationBudget: opts.iterationBudget || 1000,
  random: opts.random || (() => 1),
})

// :: () -> Stats
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
