const assert = require("assert")
const {move} = require("./ai")

const _ = null
const a = 1 // ai

const assertNextMove = t => {
  const defaultConfig = {
    winningLength: 4,
    players: [a, 0],
  }
  const applicableConfig = { ...defaultConfig, ...t.config }
  const res = move(applicableConfig, t.board)
  Object.keys(t.expectation).forEach(k => {
    assert.strictEqual(res[k], t.expectation[k])
  })
}

describe("AI", () => {
  it("Returns the next slot with which it can win", () => {
    [
      {config: {winningLength: 3},
       expectation: {iterations: 1, slot: 0},
       board: [
        // other possible outcomes: draw
        [_,_,a],
        [_,a,0],
        [_,0,a],
      ]},
      {config: {winningLength: 3},
       expectation: {iterations: 14, slot: 2},
       board: [
        // other possible outcomes: draw or lose
        [_,_,_],
        [0,0,_],
        [a,a,_],
      ]},
      {config: {winningLength: 3},
       expectation: {iterations: 1, slot: 0},
       board: [
        // other possible outcomes: draw or lose
        [_,_,_],
        [a,_,_],
        [a,0,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the next slot with which it can prevent loosing", () => {
    // Note: the situation on the boards must be so that the
    // end result can theoretically still be draw or win for the AI
    [
      {config: {winningLength: 3},
       expectation: {iterations: 8, slot: 0},
       board: [
        // other possible outcomes: draw or win
        [_,_,_],
        [0,_,_],
        [0,_,a],
      ]},
      {config: {winningLength: 3},
       expectation: {iterations: 10, slot: 1},
       board: [
        // other possible outcomes: draw or win
        [a,_,_],
        [a,_,_],
        [0,_,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterations: 62, slot: 2},
       board: [
        // othher possible outcomes: draw
        [_,_,_],
        [_,_,_],
        [_,0,a],
        [0,a,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the best slot that can potentially lead to winning", () => {
    [
      {config: {winningLength: 3},
       expectation: {iterations: 99, slot: 1},
       board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterations: 18, slot: 1},
       board: [
        [_,_,_],
        [_,_,a],
        [0,a,0],
      ]},
      {config: {winningLength: 3},
       expectation: {iterations: 3, slot: 0},
       board: [
        [_,0,_],
        [0,a,_],
        [a,a,0],
      ]},
    ].forEach(assertNextMove)
  })
})
