import { Module } from "@nestjs/common"
import { Task3Controller } from "./task3.controller"
import { Task3Service } from "./task3.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { BatchInfo } from "src/db/batchInfo.entity"

@Module({
    imports: [TypeOrmModule.forFeature([Inventory, BatchInfo])],
    controllers: [Task3Controller],
    providers: [Task3Service],
})
export class Task3Module {}
