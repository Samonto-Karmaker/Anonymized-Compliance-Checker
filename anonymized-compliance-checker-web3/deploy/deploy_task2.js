const {network}=require("hardhat");
const {verify}=require("../utils/verify");
const { developmentChains } = require("../helper-hardhat-config");

module.exports=async({getNamedAccounts,deployments})=>{
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();
    const taskTwo=await deploy("Task2",{
        contract:"Task2",
        from:deployer,
        log:true,
        args:[],
        waitConfirmations:network.config.blockConfirmations||1
    });

    log("Contract deployed at => ",taskTwo.address);

    if(!developmentChains.includes(network.name)){
        await verify(taskTwo.address,[]);
    }

}


module.exports.tags=["all","fundme"];