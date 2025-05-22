const { ethers, network, run } = require("hardhat")
require("dotenv").config()

const main = async () => {
    const contractFactory = await ethers.getContractFactory("Task3")
    const contract = await contractFactory.deploy()
    console.log("Task3 contract deployed to:", contract.target)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await contract.deploymentTransaction().wait(6)
        await verify(contract.target, [])
        console.log("Contract verified on Etherscan")
    }
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        console.log("Contract verified successfully")
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified")
        } else {
            console.error("Error verifying contract:", error)
        }
    }
}

main().catch((error) => {
    console.error("Error in deployment script:", error)
    process.exit(1)
})
