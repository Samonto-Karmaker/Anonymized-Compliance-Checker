const {network}=require("hardhat");


module.exports=async({getNamedAccounts,deployments})=>{
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();

    const chainId=network.config.chainId;

    

    const taskTwo=await deploy("Task2",{
        contract:"Task2",
        from:deployer,
        log:true,
        args:[],
        waitConfirmations:network.config.blockConfirmations||1
    });

    log("Contract deployed at => ",taskTwo.address);

}


module.exports.tags=["all","fundme"];