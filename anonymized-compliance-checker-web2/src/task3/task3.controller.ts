import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
} from "@nestjs/common"
import { InventoryService } from "./task3-inventory/inventory.service"
import { CreateInventoryDto } from "src/dto/create-inventory"
import { HashService } from "./task3-hash/hash.service"
import { BatchService } from "./task3-batch/batch.service"

@Controller("task3")
export class Task3Controller {
    constructor(
        private readonly task3Service: InventoryService,
        private readonly task3BatchService: BatchService,
        private readonly task3HashService: HashService
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
    async getHashByCreationId(@Param("internalId") internalId: string) {
        const parsedInternalId = parseInt(internalId, 10)
        return await this.task3HashService.getCreationHashByInternalId(
            parsedInternalId
        )
    }
    @Get("hash/update/:internalId")
    async getHashByUpdateId(@Param("internalId") internalId: string) {
        const parsedInternalId = parseInt(internalId, 10)
        return await this.task3HashService.getUpdateHashByInternalId(
            parsedInternalId
        )
    }

    @Get("batch/verify/creation/:id")
    async verifyCreationBatch(@Param("id") id: string) {
        const parsedId = parseInt(id, 10)
        if (isNaN(parsedId)) {
            throw new BadRequestException("Invalid batch ID")
        }
        return await this.task3BatchService.verifyCreationHashByInventoryId(
            parsedId
        )
    }
    @Get("batch/verify/update/:id")
    async verifyUpdateBatch(@Param("id") id: string) {
        const parsedId = parseInt(id, 10)
        if (isNaN(parsedId)) {
            throw new BadRequestException("Invalid batch ID")
        }
        return await this.task3BatchService.verifyUpdateHashByInventoryId(
            parsedId
        )
    }

    @Get("batch/verify/all")
    async verifyAllBatches() {
        return await this.task3BatchService.verifyAll()
    }
}
