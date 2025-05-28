import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query
} from "@nestjs/common"
import { InventoryService } from "./task3-inventory/inventory.service"
import { CreateInventoryDto } from "src/dto/create-inventory"
import { HashService } from "./task3-hash/hash.service"

@Controller("task3")
export class Task3Controller {
    constructor(
        private readonly task3Service: InventoryService,
        private readonly task3HashService:HashService
    ) {}

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

    @Get("hash/creation/:internalId")
    async getHashByCreationId(@Param("internalId") internalId:string){
        const parsedInternalId=parseInt(internalId,10)
        return await this.task3HashService.getCreationHashByInternalId(parsedInternalId);
    }
    @Get("hash/update/:internalId")
    async getHashByUpdateId(@Param("internalId") internalId:string){
        const parsedInternalId=parseInt(internalId,10)
        return await this.task3HashService.getUpdateHashByInternalId(parsedInternalId);
    }
}
