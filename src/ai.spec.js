const assert = require("assert")
const {move} = require("./ai")

const _ = null
const a = 1 // ai

const assertNextMove = t => {
  const res = move(t.winningLength, [a, 0], t.board)
  assert.strictEqual(res.slot, t.expected)
  if ("iterations" in t) {
    assert.strictEqual(res.iterations, t.iterations)
  }
}

describe("AI", () => {
  it("Returns the next slot with which it can win", () => {
    const board = [
      {winningLength: 3, iterations: 4, expected: 0, board: [
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
      {winningLength: 3, iterations: 17, expected: 2, board: [
        // other possible outcomes: draw or lose
        [_,_,_],
        [_,_,a],
        [0,0,a],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the next slot with which it can prevent loosing", () => {
    // Note: the situation on the boards must be so that the
    // end result can theoretically still be draw or win for the AI
    const board = [
      {winningLength: 3, iterations: 43, expected: 0, board: [
        // other possible outcomes: draw or win
        [_,_,_],
        [0,_,_],
        [0,_,a],
      ]},
      {winningLength: 3, iterations: 15, expected: 1, board: [
        // other possible outcomes: draw or win
        [a,_,_],
        [a,_,_],
        [0,_,0],
      ]},
      {winningLength: 3, iterations: 15, expected: 2, board: [
        [_,_,_],
        [_,0,a],
        [0,a,0],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the best slots that can potentially lead to winning", () => {
    const board = [
      {winningLength: 3, iterations: 253, expected: 1, board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {winningLength: 3, iterations: 34, expected: 2, board: [
        [_,_,_],
        [_,_,a],
        [0,a,0],
      ]},
      {winningLength: 3, iterations: 6, expected: 0, board: [
        [_,0,_],
        [0,a,_],
        [a,a,0],
      ]},
    ].forEach(assertNextMove)
  })
})
