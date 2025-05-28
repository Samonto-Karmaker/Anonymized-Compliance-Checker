import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { CreationHashUpdated } from "../generated/schema"
import { CreationHashUpdated as CreationHashUpdatedEvent } from "../generated/Task3/Task3"
import { handleCreationHashUpdated } from "../src/task-3"
import { createCreationHashUpdatedEvent } from "./task-3-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let hash = "Example string value"
    let newCreationHashUpdatedEvent = createCreationHashUpdatedEvent(id, hash)
    handleCreationHashUpdated(newCreationHashUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("CreationHashUpdated created and stored", () => {
    assert.entityCount("CreationHashUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CreationHashUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "hash",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
