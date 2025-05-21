import { Module } from "@nestjs/common"
import { Task1Controller } from "./task1.controller"
import { Task1Service } from "./task1.service"
import { Inventory } from "src/db/inventory.entity"
import { Task1ContractModule } from "src/contracts/task1/task1.contract.module"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [TypeOrmModule.forFeature([Inventory]), Task1ContractModule],
    controllers: [Task1Controller],
    providers: [Task1Service],
})
export class Task1Module {}
