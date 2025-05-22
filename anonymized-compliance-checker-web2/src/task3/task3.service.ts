import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { BatchInfo } from "src/db/batchInfo.entity"

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
}
