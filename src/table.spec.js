const assert = require("assert")
const {Table} = require("./table")

describe("Table", () => {
  it("stores given players", () => {
    const t = new Table(["Peter", "Sarah"])
    assert.deepStrictEqual(t.players()[0], {id: 0, name: "Peter"})
    assert.deepStrictEqual(t.players()[1], {id: 1, name: "Sarah"})
  })
})
