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
        const batchInfos = await this.batchInfoRepository.find({
            where: { creationBatchId: id },
            select: ["inventoryId"],
        })

        if (!batchInfos?.length) {
            throw new NotFoundException(
                `No inventories found for creationBatchId ${id}`
            )
        }

        const inventoryIds = batchInfos.map(batchInfo => batchInfo.inventoryId)

        const inventories = await this.inventoryRepository.find({
            where: { id: In(inventoryIds) },
        })

        if (!inventories?.length) {
            throw new NotFoundException(
                `No inventories found for creationBatchId ${id}`
            )
        }

        return inventories
    }
}
