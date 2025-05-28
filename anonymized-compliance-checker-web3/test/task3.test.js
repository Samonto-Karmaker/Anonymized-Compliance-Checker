const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { expect, assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Task3", function () {
          let task3, deployer, otherAccount

          beforeEach(async () => {
              ;[deployer, otherAccount] = await ethers.getSigners()
              const task3Factory = await ethers.getContractFactory("Task3")
              task3 = await task3Factory.deploy(deployer.address)
          })

          describe("Constructor", function () {
              it("Sets the correct initial owner", async () => {
                  const owner = await task3.owner()
                  assert.equal(owner, deployer.address)
              })
          })

          describe("Create", function () {
              it("Allows only the owner to update the creation hash", async () => {
                  await task3
                      .connect(deployer)
                      .create(0, "0x1234567890abcdef1234567890abcdef12345678")
                  const creationHash = await task3.latestCreationHash()
                  assert.equal(
                      creationHash,
                      "0x1234567890abcdef1234567890abcdef12345678"
                  )
              })

              it("Reverts if non-owner tries to update creation hash", async () => {
                  await expect(
                      task3
                          .connect(otherAccount)
                          .create(
                              0,
                              "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
                          )
                  ).to.be.revertedWithCustomError(
                      task3,
                      "OwnableUnauthorizedAccount"
                  )
              })

              it("Emits an event on create", async () => {
                  await expect(
                      task3
                          .connect(deployer)
                          .create(
                              0,
                              "0x1234567890abcdef1234567890abcdef12345678"
                          )
                  )
                      .to.emit(task3, "CreationHashUpdated")
                      .withArgs(0, "0x1234567890abcdef1234567890abcdef12345678")
              })
          })

          describe("Update", function () {
              it("Allows only the owner to update the update hash", async () => {
                  await task3
                      .connect(deployer)
                      .update(0, "0x1234567890abcdef1234567890abcdef12345678")
                  const updateHash = await task3.latestUpdateHash()
                  assert.equal(
                      updateHash,
                      "0x1234567890abcdef1234567890abcdef12345678"
                  )
              })

              it("Reverts if non-owner tries to update update hash", async () => {
                  await expect(
                      task3
                          .connect(otherAccount)
                          .update(
                              0,
                              "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
                          )
                  ).to.be.revertedWithCustomError(
                      task3,
                      "OwnableUnauthorizedAccount"
                  )
              })

              it("Emits an event on update", async () => {
                  await expect(
                      task3
                          .connect(deployer)
                          .update(
                              0,
                              "0x1234567890abcdef1234567890abcdef12345678"
                          )
                  )
                      .to.emit(task3, "UpdateHashUpdated")
                      .withArgs(0, "0x1234567890abcdef1234567890abcdef12345678")
              })
          })
      })
