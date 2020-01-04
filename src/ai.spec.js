const assert = require("assert")
const {nextSlot} = require("./ai")

const _ = null
const a = 1 // ai

const assertNextMove = t => {
  const res = nextSlot(t.winningLength, [a, 0], t.board)
  if ("iterations" in t) {
    assert.strictEqual(res.iterations, t.iterations)
  }
  assert.strictEqual(res.nextSlot, t.expected)
}

describe.only("AI", () => {
  it("Returns the next slot with which it can win", () => {
    const board = [
      {winningLength: 3, iterations: 5, expected: 0, board: [
        [_,_,a],
        [_,a,0],
        [_,0,a],
      ]},
      {winningLength: 3, iterations: 9, expected: 1, board: [
        [_,_,_],
        [0,_,0],
        [a,_,a],
      ]},
      {winningLength: 3, iterations: 17, expected: 2, board: [
        [_,_,_],
        [_,_,a],
        [0,0,a],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the next slot with which it can prevent loosing", () => {
    const board = [
      {winningLength: 3, iterations: 24, expected: 0, board: [
        [_,_,_],
        [0,_,_],
        [0,a,a],
      ]},
      {winningLength: 3, iterations: 17, expected: 1, board: [
        [a,_,_],
        [a,_,_],
        [0,_,0],
      ]},
      {winningLength: 3, iterations: 3, expected: 2, board: [
        [_,a,_],
        [_,0,a],
        [0,a,a],
      ]},
    ].forEach(assertNextMove)
  })

  it("Returns the slots that lead to winning", () => {
    const board = [
      {winningLength: 3, iterations: 299, expected: 1, board: [
        [_,_,_],
        [_,_,_],
        [_,a,0],
      ]},
      {winningLength: 3, iterations: 14, expected: 1, board: [
        [_,_,_],
        [0,a,_],
        [a,a,0],
      ]},
      {winningLength: 3, iterations: 7, expected: 0, board: [
        [_,0,_],
        [0,a,_],
        [a,a,0],
      ]},
    ].forEach(assertNextMove)
  })
})
