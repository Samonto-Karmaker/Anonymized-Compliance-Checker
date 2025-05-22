import { Controller, Get } from "@nestjs/common"
import { Task3Service } from "./task3.service"

@Controller("task3")
export class Task3Controller {
    constructor(private readonly task3Service: Task3Service) {}

    @Get("all")
    async getInventory() {
        return await this.task3Service.getInventory()
    }
}
