import { Injectable } from "@nestjs/common"
import { ethers } from "ethers"
import { abi } from "./task2.abi"

@Injectable()
export class Task2ContractService {
    private readonly contractAddress = "0xYourContractAddress"

    private readonly abi = abi

    private readonly provider = new ethers.JsonRpcProvider(
        "https://your_rpc_url"
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
