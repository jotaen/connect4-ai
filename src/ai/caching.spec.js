const assert = require("assert")
const { withCache } = require("./caching")
const { SCORE } = require("./datastructures")

function CallSpy() {
  this.count = 0
}
CallSpy.prototype.invoker = function(score) {
  return () => {
    this.count++
    return {score: score}
  }
}
CallSpy.prototype.thrower = function() {
  return () => { throw "INVOKED" }
}

describe("Caching", () => {
  it("calls `eval` if cache is empty", () => {
    const spy = new CallSpy()
    withCache(spy.invoker(SCORE.UNKNOWN), new Map(), new Map())([[1]], [])
    assert.strictEqual(spy.count, 1)
  })

  it("puts defined scores into the persistent cache", () => {
    const spy = new CallSpy()
    const persistentCache = new Map()
    const transientCache = new Map()
    withCache(spy.invoker(SCORE.WIN), persistentCache, transientCache)([[1]], [])
    withCache(spy.invoker(SCORE.LOST), persistentCache, transientCache)([[2]], [])
    withCache(spy.invoker(SCORE.DRAW), persistentCache, transientCache)([[3]], [])
    assert.strictEqual(persistentCache.size, 3)
    assert.strictEqual(transientCache.size, 0)
  })

  it("serves known defined scores from persistent cache", () => {
    const spy = new CallSpy()
    const persistentCache = new Map()
    withCache(spy.invoker(0.3), persistentCache, new Map())([[1]], [])
    const nr = withCache(spy.thrower(), persistentCache, new Map())([[1]], [])
    assert.strictEqual(nr.score, 0.3)
  })

  it("puts unknown scores into the transient cache", () => {
    const spy = new CallSpy()
    const persistentCache = new Map()
    const transientCache = new Map()
    withCache(spy.invoker(SCORE.UNKNOWN), persistentCache, transientCache)([[1]], [])
    withCache(spy.invoker(SCORE.UNKNOWN), persistentCache, transientCache)([[2]], [])
    assert.strictEqual(persistentCache.size, 0)
    assert.strictEqual(transientCache.size, 2)
  })

  it("serves unknown scores from transient cache", () => {
    const spy = new CallSpy()
    const transientCache = new Map()
    withCache(spy.invoker(SCORE.UNKNOWN), new Map(), transientCache)([[1]], [])
    const nr = withCache(spy.thrower(), new Map(), transientCache)([[1]], [])
    assert.strictEqual(nr.score, SCORE.UNKNOWN)
  })
})
