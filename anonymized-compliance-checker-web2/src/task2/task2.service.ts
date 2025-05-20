import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { Repository } from "typeorm"
import { Task2ContractService } from "src/contracts/task2/task2.contract.service"

@Injectable()
export class Task2Service {
    constructor(
        @InjectRepository(Inventory)
        private inventoryRepo: Repository<Inventory>,
        private task2ContractService: Task2ContractService
    ) {}

    async getRowCount(): Promise<number> {
        return this.inventoryRepo.count()
    }

    private toUnix(date: Date | null): number {
        return date ? Math.floor(new Date(date).getTime() / 1000) : 0
    }

    async getDatesInBatch(batchNumber: number, batchSize: number) {
        const skip = (batchNumber - 1) * batchSize
        const batch = await this.inventoryRepo.find({
            skip,
            take: batchSize,
            select: ["id", "dateOfExpiry", "dateOfDisbursement"],
            order: { id: "ASC" },
        })

        const dateObjs = batch
            .filter(i => i.dateOfDisbursement && i.dateOfExpiry)
            .map(item => ({
                expiryDate: this.toUnix(item.dateOfExpiry),
                disbursedDate: this.toUnix(item.dateOfDisbursement),
            }))

        try {
            const contract = this.task2ContractService.getContract()
            await contract.validate(dateObjs)
            console.log("Passed validation.")
        } catch (err) {
            console.error("Validation failed")
        }
    }
}
