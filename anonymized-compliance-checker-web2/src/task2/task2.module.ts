import { Module } from "@nestjs/common"
import { Task2Controller } from "./task2.controller"
import { Task2Service } from "./task2.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Inventory } from "src/task1/task1.entity"

@Module({
    imports:[TypeOrmModule.forFeature([Inventory])],
    controllers: [Task2Controller],
    providers: [Task2Service],
})
export class Task2Module {}
