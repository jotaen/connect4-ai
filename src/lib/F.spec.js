const assert = require("assert")
const F = require("./F")

describe("F (functional programming utility)", () => {
  describe("maxBy", () => {
    it("Finds one of two elements for which fn produces the larger numerical value", () => {
      assert.deepStrictEqual(F.maxBy(p => p.name)(
        {name: "Peter", age: 18}, {name: "Sarah", age: 63}
      ),
        {name: "Sarah", age: 63}
      )

      assert.deepStrictEqual(F.maxBy(Math.abs)(
        -99, 44
      ),
        -99
      )
    })
  })

  describe("minBy", () => {
    it("Finds one of two elements for which fn produces the smaller numerical value", () => {
      assert.deepStrictEqual(F.minBy(p => p.name)(
        {name: "Boris", age: 23}, {name: "Simone", age: 41}
      ),
        {name: "Boris", age: 23}
      )

      assert.deepStrictEqual(F.minBy(Math.abs)(
        -99, 44
      ),
        44
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