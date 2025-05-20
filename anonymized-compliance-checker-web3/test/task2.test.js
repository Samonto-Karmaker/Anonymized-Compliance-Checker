const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { expect } = require("chai");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Task2", function () {
      let deployer, task2;

      beforeEach(async () => {
        await deployments.fixture(["all"]);
        deployer = (await getNamedAccounts()).deployer;
        const task2Deployment = await deployments.get("Task2");
        task2 = await ethers.getContractAt(
          "Task2",
          task2Deployment.address
        );
      });

      describe("validate", function () {
        it("checks whether the checker function passing properly", async () => {
          const dates = [
            {
              expiryDate: 1764633600,
              disbursedDate: 1747699200,
            },
          ];
          const res = await task2.validate(dates);
          await expect(res).to.not.be.reverted;
        });

        it("checks whether the checker function failling properly", async () => {
          const dates = [
            {
              expiryDate: 1747699200,
              disbursedDate: 1747699200,
            },
          ];
          await expect(task2.validate(dates)).to.be.revertedWithCustomError(
            task2,
            "TaskTwo_RulesViolated"
          );
        });
      });
    });
