import { Module } from "@nestjs/common"
import { Task2Controller } from "./task2.controller"
import { Task2Service } from "./task2.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Inventory } from 'src/db/inventory.entity';
import { Task2ContractModule } from "src/contracts/task2/task2.contract.module";

@Module({
    imports:[TypeOrmModule.forFeature([Inventory]),Task2ContractModule],
    controllers: [Task2Controller],
    providers: [Task2Service],
    exports:[Task2Service]
})
export class Task2Module {}
