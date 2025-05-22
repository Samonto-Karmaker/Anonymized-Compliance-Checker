import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common"
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
    @Patch("update-disbursement-date/:id")
    updateDisbursementDate(
        @Param("id") id: string,
        @Body("date") date: string
    ) {
        const inventoryId = parseInt(id, 10)
        if (isNaN(inventoryId)) {
            throw new BadRequestException("Invalid inventory ID")
        }
        return this.task3Service.updateDisbursementDate(
            inventoryId,
            new Date(date)
        )
    }
}
