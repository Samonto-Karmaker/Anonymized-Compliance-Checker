import { Body, Controller, Get, Post } from "@nestjs/common"
import { Task3Service } from "./task3.service"
import { CreateInventoryDto } from "src/dto/create-inventory"

@Controller("task3")
export class Task3Controller {
    constructor(private readonly task3Service: Task3Service) {}

    @Get("all")
    getInventory() {
        return this.task3Service.getInventory()
    }
    @Post("create")
    createInventory(@Body() createInventoryDto: CreateInventoryDto) {
        return this.task3Service.createInventory(createInventoryDto)
    }
}
