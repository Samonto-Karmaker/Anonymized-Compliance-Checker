import { Module } from "@nestjs/common"
import { Task1ContractService } from "./task1.contract.service"

@Module({
    providers: [Task1ContractService],
    exports: [Task1ContractService],
})
export class Task1ContractModule {}
