const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const taskOne = await deploy("Task1", {
        contract: "Task1", 
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    if(!developmentChains.includes(network.name)){
        await verify(taskOne.address,[]);
    }
    console.log("Contract deployed at =>", taskOne.address);
};

module.exports.tags = ["all", "task1"];
