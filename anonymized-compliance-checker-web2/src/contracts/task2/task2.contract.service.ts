import { Injectable } from "@nestjs/common"
import { ethers } from "ethers"
import { abi } from "./task2.abi"

@Injectable()
export class Task2ContractService {
    private readonly contractAddress = process.env.CONTRACT_ADDRESS_TASK2 || ""

    private readonly abi = abi

    private readonly provider = new ethers.JsonRpcProvider(
        process.env.SEPOLIA_RPC_URL_TASK2
    )

    private readonly contract = new ethers.Contract(
        this.contractAddress,
        this.abi,
        this.provider
    )

    getContract() {
        return this.contract
    }
}
