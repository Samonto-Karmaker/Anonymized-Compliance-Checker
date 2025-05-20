import { Module } from "@nestjs/common"
import { Task2Controller } from "./task2.controller"
import { Task2Service } from "./task2.service"

@Module({
    controllers: [Task2Controller],
    providers: [Task2Service],
})
export class Task2Module {}
