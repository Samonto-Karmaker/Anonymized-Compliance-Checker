import { Module } from "@nestjs/common"
import { Task3Controller } from "./task3.controller"
import { InventoryService } from "./task3-inventory/inventory.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { BatchInfo } from "src/db/batchInfo.entity"
import { CronService } from "./task3-cron/cron.service"

@Module({
    imports: [TypeOrmModule.forFeature([Inventory, BatchInfo])],
    controllers: [Task3Controller],
    providers: [InventoryService, CronService],
})
export class Task3Module {}
