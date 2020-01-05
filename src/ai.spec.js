const assert = require("assert")
const {move} = require("./ai")

const _ = null
const a = 1 // ai

const assertNextMove = t => {
  const config = {
    winningLength: t.winningLength,
    players: [a, 0],
  }
  const res = move(config, t.board)
  assert.strictEqual(res.slot, t.expected)
  if ("iterations" in t) {
    assert.strictEqual(res.iterations, t.iterations)
  }
}

describe("AI", () => {
  it("Returns the next slot with which it can win", () => {
    const board = [
      {winningLength: 3, iterations: 1, expected: 0, board: [
        // other possible outcomes: draw
        [_,_,a],
        [_,a,0],
        [_,0,a],
      ]},
      {winningLength: 3, iterations: 14, expected: 2, board: [
        // other possible outcomes: draw or lose
        [_,_,_],
        [0,0,_],
        [a,a,_],
      ]},
      {winningLength: 3, iterations: 1, expected: 0, board: [
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
    const board = [
      {winningLength: 3, iterations: 8, expected: 0, board: [
        // other possible outcomes: draw or win
        [_,_,_],
        [0,_,_],
        [0,_,a],
      ]},
      {winningLength: 3, iterations: 10, expected: 1, board: [
        // other possible outcomes: draw or win
        [a,_,_],
        [a,_,_],
        [0,_,0],
      ]},
      {winningLength: 3, iterations: 62, expected: 2, board: [
        // othher possible outcomes: draw
        [_,_,_],
        [_,_,_],
        [_,0,a],
        [0,a,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the best slots that can potentially lead to winning", () => {
    const board = [
      {winningLength: 3, iterations: 99, expected: 1, board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {winningLength: 3, iterations: 18, expected: 1, board: [
        [_,_,_],
        [_,_,a],
        [0,a,0],
      ]},
      {winningLength: 3, iterations: 3, expected: 0, board: [
        [_,0,_],
        [0,a,_],
        [a,a,0],
      ]},
    ].forEach(assertNextMove)
  })
})
