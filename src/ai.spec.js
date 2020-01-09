const assert = require("assert")
const { move, SCORE } = require("./ai")

const _ = null
const a = 1 // ai

const assertNextMove = t => {
  const defaultConfig = {
    winningLength: 4,
    players: [a, 0],
    iterationBudget: Number.MAX_SAFE_INTEGER,
  }
  const applicableConfig = { ...defaultConfig, ...t.config }
  const res = move(applicableConfig, t.board)
  Object.keys(t.expectation).forEach(k => {
    assert.strictEqual(res[k], t.expectation[k], k)
  })
}

describe("AI", () => {
  it("Returns the next slot with which it can win", () => {
    [
      {config: {winningLength: 3},
       expectation: {iterationCount: 4, slot: 0, isWin: true},
       board: [
        // other possible outcomes: draw
        [_,_,a],
        [_,a,0],
        [_,0,a],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 15, slot: 2, isWin: true},
       board: [
        // other possible outcomes: draw or lose
        [_,_,_],
        [0,0,_],
        [a,a,_],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 17, slot: 0, isWin: true},
       board: [
        // other possible outcomes: win, draw or lose
        [_,_,_],
        [a,_,_],
        [a,0,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the next slot with which it can prevent loosing", () => {
    // Note: the situation on the boards is so that the end result
    // can theoretically still be draw or win for the AI
    [
      {config: {winningLength: 3},
       expectation: {iterationCount: 34, slot: 0, isWin: true},
       board: [
        // other possible outcomes: draw or win
        [_,_,_],
        [0,_,_],
        [0,_,a],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 14, slot: 1, isWin: true},
       board: [
        // other possible outcomes: draw or win
        [a,_,_],
        [a,_,_],
        [0,_,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 9, slot: 0, isWin: true},
       board: [
        // other possible outcomes: draw or win
        [_,_,_],
        [_,_,0],
        [_,0,a],
        [_,a,a],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the slot to avoid an immediate loss", () => {
    // Note: the situation on the boards is so that the AI will
    // lose in any event
    [
      {config: {winningLength: 3},
       expectation: {slot: 0, isLost: true},
       board: [
        [_,_,_],
        [0,_,_],
        [0,a,a],
      ]},
      {config: {winningLength: 3},
       expectation: {slot: 2, isLost: true},
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
       expectation: {iterationCount: 184, slot: 1, isWin: true},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 29, slot: 1, isWin: true},
       board: [
        [_,_,_],
        [_,_,a],
        [0,a,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterationCount: 6, slot: 0, isWin: true},
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
       expectation: {iterationCount: 4, slot: 1, isUnknown: true},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 10},
       expectation: {iterationCount: 13, slot: 1, isUnknown: true},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 50},
       expectation: {iterationCount: 52, slot: 1, isUnknown: true},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 100},
       expectation: {iterationCount: 104, slot: 1, isUnknown: true},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 500},
       expectation: {iterationCount: 248, slot: 1, isWin: true},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3, iterationBudget: 1000},
       expectation: {iterationCount: 184, slot: 1, isWin: true},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
    ].forEach(assertNextMove)
  })
})
