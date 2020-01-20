const assert = require("assert")
const { randomiseChance } = require("./randomising")

const isBetween = (lower, upper) => x => x > lower && x < upper

describe("Randomising", () => {
  it("has a left-to-right distribution long-term", () => {
    const slotCount = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    }
    const rand = randomiseChance(Math.random)
    for (let i=0; i<10000; i++) {
      const chances = rand([{},{},{},{},{},{},{}]).map(nr => nr.chance)
      const slot = chances.indexOf(Math.max(...chances))
      slotCount[slot] = slotCount[slot]+1
    }
    assert.ok(isBetween(4800, 5500)(slotCount[0]))
    assert.ok(isBetween(1300, 1900)(slotCount[1]))
    assert.ok(isBetween(800, 1200)(slotCount[2]))
    assert.ok(isBetween(500, 900)(slotCount[3]))
  })

  it("doesn’t overwrite chances above threshold", () => {
    const rand = randomiseChance(() => 0)
    const chances = rand([{},{chance: 1},{},{},{},{chance: 25},{}])
    assert.strictEqual(chances[0].chance, 0)
    assert.strictEqual(chances[1].chance, 1)
    assert.strictEqual(chances[2].chance, 0)
    assert.strictEqual(chances[3].chance, 0)
    assert.strictEqual(chances[4].chance, 0)
    assert.strictEqual(chances[5].chance, 25)
    assert.strictEqual(chances[6].chance, 0)
  })
})
