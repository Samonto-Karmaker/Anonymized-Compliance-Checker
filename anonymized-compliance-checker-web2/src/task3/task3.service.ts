import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { BatchInfo } from "src/db/batchInfo.entity"
import { CreateInventoryDto } from "src/dto/create-inventory"

@Injectable()
export class Task3Service {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @InjectRepository(BatchInfo)
        private readonly batchInfoRepository: Repository<BatchInfo>
    ) {}

    async getInventory(): Promise<Inventory[]> {
        return await this.inventoryRepository.find()
    }
    async createInventory(
        createInventoryDto: CreateInventoryDto
    ): Promise<Inventory> {
        try {
            const inventory =
                this.inventoryRepository.create(createInventoryDto)
            const savedInventory =
                await this.inventoryRepository.save(inventory)
            return savedInventory
        } catch (error) {
            console.error("Error creating inventory:", error)
            throw new InternalServerErrorException(
                "Error creating inventory. Please try again later."
            )
        }
    }
}
