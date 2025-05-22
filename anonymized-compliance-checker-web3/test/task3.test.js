const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { expect, assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Task 3", function () {
          let task3

          beforeEach(async () => {
              const task3factory = await ethers.getContractFactory("Task3")
              task3 = await task3factory.deploy()
          })

          describe("Create", function () {
              it("Updates the creation hash", async () => {
                  await task3.create(
                      0,
                      "0x1234567890abcdef1234567890abcdef12345678"
                  )
                  const creationHash = await task3.latestCreationHash()
                  assert.equal(
                      creationHash,
                      "0x1234567890abcdef1234567890abcdef12345678"
                  )
              })
              it("Emits an event on create", async () => {
                  await expect(
                      task3.create(
                          0,
                          "0x1234567890abcdef1234567890abcdef12345678"
                      )
                  )
                      .to.emit(task3, "CreationHashUpdated")
                      .withArgs(0, "0x1234567890abcdef1234567890abcdef12345678")
              })
          })

          describe("Update", function () {
              it("Updates the update hash", async () => {
                  await task3.update(
                      0,
                      "0x1234567890abcdef1234567890abcdef12345678"
                  )
                  const updateHash = await task3.latestUpdateHash()
                  assert.equal(
                      updateHash,
                      "0x1234567890abcdef1234567890abcdef12345678"
                  )
              })
              it("Emits an event on update", async () => {
                  await expect(
                      task3.update(
                          0,
                          "0x1234567890abcdef1234567890abcdef12345678"
                      )
                  )
                      .to.emit(task3, "UpdateHashUpdated")
                      .withArgs(0, "0x1234567890abcdef1234567890abcdef12345678")
              })
          })
      })
