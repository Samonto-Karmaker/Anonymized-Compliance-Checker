import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { Task1Module } from "./task1/task1.module"
import { Task2Module } from "./task2/task2.module"
import { Task3Module } from "./task3/task3.module"

@Module({
    imports: [Task1Module, Task2Module, Task3Module],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
