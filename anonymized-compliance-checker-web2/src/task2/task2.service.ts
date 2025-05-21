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

    private toUnix(date: Date | null): number {
        return date ? Math.floor(new Date(date).getTime() / 1000) : 0
    }

    async getDatesInBatch(batchSize: number): Promise<{ msg: string ,code: number}> {
        const total = await this.inventoryRepo.count()
        const totalBatch = Math.ceil(total / batchSize)

        for (let batchNumber = 1; batchNumber <= totalBatch; batchNumber++) {
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
            } catch (err) {
                return { msg: `Validation failed for batch no ${batchNumber}!`, code:400 }
            }
        }
        return { msg: "Validation passed.",code:200 }
    }
}
