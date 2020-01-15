const assert = require("assert")
const R = require("ramda")
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

  describe("compareCloseTo", () => {
    it("can be used to sort array numbers around specific values", () => {
      assert.deepStrictEqual(R.sort(F.compareCloseTo(3))(
        [0, 1, 2, 3, 4, 5]
      ),
        [3, 4, 2, 5, 1, 0]
      )

      assert.deepStrictEqual(R.sort(F.compareCloseTo(1))(
        [0, 1, 2, 3, 4, 5]
      ),
        [1, 2, 0, 3, 4, 5]
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

  describe("mapIterateUntil", () => {
    it("Iterates over array as long as predicate is truthy", () => {
      const result = F.mapIterateUntil(
        (xs) => R.sum(xs) < 50,
        x => x + 1
      )([1, 2, 3, 4, 5])
      assert.deepStrictEqual(result, [8, 9, 10, 11, 12])
    })

    it("It checks the predicate on every single iteration", () => {
      let i = 0
      const result = F.mapIterateUntil(
        () => i++ < 3,
        x => x + 1
      )([10, 10, 10, 10, 10])
      assert.deepStrictEqual(result, [11, 11, 11, 10, 10])
    })
  })
})
