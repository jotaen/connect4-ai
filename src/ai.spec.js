const assert = require("assert")
const {nextSlot} = require("./ai")

const X = null

describe("AI", () => {
  it("Returns the next slot it wants to put into", () => {
    const board = [
      [X,X,X,X,X,X,X],
      [X,X,X,X,X,X,X],
      [X,X,X,X,X,X,X],
      [X,X,X,X,X,X,X],
      [X,X,X,X,X,X,X],
      [X,X,X,X,X,X,X],
    ]
    assert.strictEqual(nextSlot(board), 0)
  })
})
