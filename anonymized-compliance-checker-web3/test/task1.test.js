const { expect } = require("chai");
const { deployments, ethers } = require("hardhat");
const crypto = require("crypto");

function sha256(data) {
  return "0x" + crypto.createHash("sha256").update(data).digest("hex");
}

describe("Task1 contract", function () {
  let task1, deployer;

  beforeEach(async () => {
    await deployments.fixture(["task1"]);

    const accounts = await ethers.getSigners();
    deployer = accounts[0];

    const taskOneDeployment = await deployments.get("Task1");

    task1 = await ethers.getContractAt("Task1", taskOneDeployment.address, deployer);
  });

  it("should set the deployer as the owner", async function () {
    expect(await task1.owner()).to.equal(deployer.address);
  });

  it("should mark known blacklisted fields as non-compliant", async function () {
    const blacklisted = "0x5D3575D1A0AB5B2F5EE09A5E4FBAE19BCAA9F9343659AA29603B2CBC9AB5D99D";
    expect(await task1.isCompliant([blacklisted])).to.be.false;
  });

  it("should return true if no blacklisted fields are found", async function () {
    const randomHash = sha256("not_blacklisted");
    expect(await task1.isCompliant([randomHash])).to.be.true;
  });

  it("should return true for empty array", async function () {
    expect(await task1.isCompliant([])).to.be.true;
  });
});
