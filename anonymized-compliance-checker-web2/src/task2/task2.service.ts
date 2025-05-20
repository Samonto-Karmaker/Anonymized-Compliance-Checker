import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { Repository } from "typeorm"

@Injectable()
export class Task2Service {
    constructor(
        @InjectRepository(Inventory)
        private inventoryRepo: Repository<Inventory>
    ) {}

    async getRowCount(): Promise<number> {
        return this.inventoryRepo.count()
    }

    async getDatesInBatch(batchNumber: number, batchSize: number) {
        const skip = (batchNumber - 1) * batchSize
        const batch = await this.inventoryRepo.find({
            skip,
            take: batchSize,
            select: ["id", "dateOfExpiry", "dateOfDisbursement"],
            order: { id: "ASC" },
        })

        return batch
    }
}
