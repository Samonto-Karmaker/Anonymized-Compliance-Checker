import { Module } from "@nestjs/common"
import { Task3Controller } from "./task3.controller"
import { InventoryService } from "./task3-inventory/inventory.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { BatchInfo } from "src/db/batchInfo.entity"
import { CronService } from "./task3-cron/cron.service"
import { BatchService } from "./task3-batch/batch.service"
import { HashService } from "./task3-hash/hash.service"
import { Task3ContractModule } from "src/contracts/task3/task3.contract.module"

@Module({
    imports: [
        TypeOrmModule.forFeature([Inventory, BatchInfo]),
        Task3ContractModule,
    ],
    controllers: [Task3Controller],
    providers: [InventoryService, CronService, BatchService, HashService],
})
export class Task3Module {}
