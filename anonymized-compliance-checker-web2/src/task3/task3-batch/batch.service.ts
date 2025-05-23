import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { BatchInfo } from "src/db/batchInfo.entity"
import { Inventory } from "src/db/inventory.entity"
import { In, Repository } from "typeorm"

@Injectable()
export class BatchService {
    constructor(
        @InjectRepository(BatchInfo)
        private readonly batchInfoRepository: Repository<BatchInfo>,
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>
    ) {}

    async getBatchInfoByInventoryId(id: number): Promise<BatchInfo> {
        const batchInfo = await this.batchInfoRepository.findOne({
            where: { inventoryId: id },
        })
        if (!batchInfo) {
            throw new NotFoundException(`BatchInfo with ID ${id} not found`)
        }
        return batchInfo
    }

    async getInventoryByCreationBatchId(id: number): Promise<Inventory[]> {
        return this.getInventoriesByBatchField("creationBatchId", id)
    }

    async getInventoryByUpdateBatchId(id: number): Promise<Inventory[]> {
        return this.getInventoriesByBatchField("updateBatchId", id)
    }

    async getUntrackedInventories(): Promise<Inventory[]> {
        return this.inventoryRepository
            .createQueryBuilder("inventory")
            .leftJoin(
                "batch_info",
                "batchInfo",
                "batchInfo.inventoryId = inventory.id"
            )
            .where("batchInfo.inventoryId IS NULL")
            .orWhere("batchInfo.creationBatchId IS NULL")
            .getMany()
    }

    async getInventoriesReadyForUpdateTracking(): Promise<Inventory[]> {
        return this.inventoryRepository
            .createQueryBuilder("inventory")
            .innerJoin(
                "batch_info",
                "batchInfo",
                "batchInfo.inventoryId = inventory.id"
            )
            .where("batchInfo.creationBatchId IS NOT NULL")
            .andWhere("inventory.dateOfDisbursement IS NOT NULL")
            .andWhere("batchInfo.updateBatchId IS NULL")
            .getMany()
    }

    // Helper functions
    private async getInventoriesByBatchField(
        batchField: "creationBatchId" | "updateBatchId",
        id: number
    ): Promise<Inventory[]> {
        const batchInfos = await this.batchInfoRepository.find({
            where: { [batchField]: id },
            select: ["inventoryId"],
        })

        if (!batchInfos.length) {
            throw new NotFoundException(
                `No inventories found for ${batchField} ${id}`
            )
        }

        const inventoryIds = batchInfos.map(batchInfo => batchInfo.inventoryId)

        const inventories = await this.inventoryRepository.find({
            where: { id: In(inventoryIds) },
        })

        if (!inventories.length) {
            throw new NotFoundException(
                `No inventories found for ${batchField} ${id}`
            )
        }

        return inventories
    }
}
