import { Module } from "@nestjs/common"
import { Task3ContractService } from "./task3.contract.service"

@Module({
    providers: [Task3ContractService],
    exports: [Task3ContractService],
})
export class Task3ContractModule {}
