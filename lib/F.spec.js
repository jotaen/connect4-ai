const assert = require("assert")
const F = require("./F")

describe("F (functional programming utility)", () => {
  describe("maxBy", () => {
    it("Finds the element in array for the maximum value provided by the function", () => {
      assert.deepStrictEqual(F.maxBy(p => p[1])([
        ["Peter", 18], ["Sarah", 63], ["Luke", 12], ["Lisa", 37]
      ]),
        ["Sarah", 63]
      )

      assert.deepStrictEqual(F.maxBy(Math.abs)([
        -99, 44, 1, -43, 15, 102, -354, 69, 299
      ]),
        -354
      )
    })
  })

  describe("minBy", () => {
    it("Finds the element in array for the minimum value provided by the function", () => {
      assert.deepStrictEqual(F.minBy(p => p[1])([
        ["Peter", 18], ["Sarah", 63], ["Luke", 12], ["Lisa", 37]
      ]),
        ["Luke", 12]
      )

      assert.deepStrictEqual(F.minBy(Math.abs)([
        -99, 44, 1, -43, 15, 102, -354, 69, 299
      ]),
        1
      )
    })
  })

  describe("transposeDiagonal", () => {
    it("Transposes a list of lists diagonally (returns a list of all diagonals)", () => {
      assert.deepStrictEqual(F.transposeDiagonal([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]), [
        [7],
        [4, 8],
        [1, 5, 9],
        [2, 6],
        [3],
      ])
    })
  })

  describe("peek", () => {
    it("Executes a function and returns the original value", () => {
      let spy = false
      const orig = F.peek(s => {spy = s})(true)
      assert.strictEqual(spy, true)
      assert.strictEqual(orig, true)
    })
  })

  describe("hasLength", () => {
    it("Checks whether list is of given length", () => {
      const isTuple = F.hasLength(2)
      assert.strictEqual(isTuple([1]), false)
      assert.strictEqual(isTuple([1, 2]), true)
      assert.strictEqual(isTuple([1, 2, 3]), false)
    })
  })
})
