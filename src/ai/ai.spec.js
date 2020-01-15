const assert = require("assert")
const { move } = require("./ai")
const { SCORE } = require("./datastructures")

const _ = null
const a = 1 // ai

const assertNextMove = t => {
  const defaultConfig = {
    winningLength: 4,
    players: [a, 0],
    iterationBudget: Number.MAX_SAFE_INTEGER,
  }
  const applicableConfig = { ...defaultConfig, ...t.config }
  const res = move(applicableConfig, t.board, new Map())
  Object.keys(t.expectation).forEach(k => {
    assert.strictEqual(res[k], t.expectation[k], k)
  })
}

describe("AI", () => {
  it("Returns the next slot with which it can win immediately", () => {
    [
      {config: {winningLength: 3},
       expectation: {iterationCount: 4, slot: 0, score: SCORE.WIN, depth: 0},
       board: [
        // other possible outcomes: draw
        [_,_,a],
        [_,a,0],
        [_,0,a],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 7, slot: 2, score: SCORE.WIN, depth: 0},
       board: [
        // other possible outcomes: draw or lose
        [_,_,_],
        [0,0,_],
        [a,a,_],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 8, slot: 0, score: SCORE.WIN, depth: 0},
       board: [
        // other possible outcomes: win, draw or lose
        [_,_,_],
        [a,_,_],
        [a,0,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the next slot with which it can prevent loosing", () => {
    // Note: iteration budget must be capped so that final score is unknown
    [
      {config: {winningLength: 3, iterationBudget: 20},
       expectation: {iterationCount: 37, slot: 0, score: SCORE.UNKNOWN},
       board: [
        [_,_,_],
        [_,_,_],
        [0,_,_],
        [0,_,a],
      ]},
      {config: {winningLength: 3, iterationBudget: 7},
       expectation: {iterationCount: 9, slot: 1, score: SCORE.UNKNOWN},
       board: [
        [_,_,_],
        [_,_,_],
        [a,_,a],
        [0,_,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 15},
       expectation: {iterationCount: 20, slot: 2, score: SCORE.UNKNOWN},
       board: [
        [_,_,_],
        [_,_,_],
        [_,0,a],
        [0,a,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the slot to avoid an immediate loss", () => {
    // Note: the situation on the boards is so that the AI will
    // lose in any event
    [
      {config: {winningLength: 3},
       expectation: {slot: 0, score: SCORE.LOST, depth: 3},
       board: [
        [_,_,_],
        [0,_,_],
        [0,a,a],
      ]},
      {config: {winningLength: 3},
       expectation: {slot: 2, score: SCORE.LOST, depth: 3},
       board: [
        [_,_,_],
        [_,_,0],
        [a,a,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the best slot that can potentially lead to winning", () => {
    [
      {config: {winningLength: 3},
       expectation: {iterationCount: 66, slot: 1, score: SCORE.WIN, depth: 6},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 19, slot: 1, score: SCORE.WIN, depth: 2},
       board: [
        [_,_,_],
        [_,_,a],
        [0,a,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 6, slot: 0, score: SCORE.WIN, depth: 2},
       board: [
        [_,0,_],
        [0,a,_],
        [a,a,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Yields different results based on iteration budget", () => {
    [
      {config: {winningLength: 3, iterationBudget: 1},
       expectation: {iterationCount: 4, slot: 1, score: SCORE.UNKNOWN, maxIterationDepth: 1},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 10},
       expectation: {iterationCount: 13, slot: 1, score: SCORE.UNKNOWN, maxIterationDepth: 2},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 30},
       expectation: {iterationCount: 32, slot: 1, score: SCORE.UNKNOWN, maxIterationDepth: 3},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 100},
       expectation: {iterationCount: 103, slot: 2, score: SCORE.UNKNOWN, maxIterationDepth: 5},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 500},
       expectation: {iterationCount: 97, slot: 1, score: SCORE.WIN},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 1000},
       expectation: {iterationCount: 66, slot: 1, score: SCORE.WIN},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
    ].forEach(assertNextMove)
  })
})
