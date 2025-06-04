import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { Repository } from "typeorm"
import { Task2ContractService } from "src/contracts/task2/task2.contract.service"
import { randomBytes } from "crypto"

@Injectable()
export class Task2Service {
    constructor(
        @InjectRepository(Inventory)
        private inventoryRepo: Repository<Inventory>,
        private task2ContractService: Task2ContractService
    ) {}

    private toUnix(date: Date | null, maskNumber: number): number {
        return (
            (date ? Math.floor(new Date(date).getTime() / 1000) : 0) +
            maskNumber
        )
    }

    private getSecureRandomInt(): number {
        const min = parseInt(process.env.SECURE_MIN || "", 10)
        const max = parseInt(process.env.SECURE_MAX || "", 10)
        const range = max - min + 1

        const byteLength = Math.ceil(Math.log2(range) / 8)
        let randomInt: number

        do {
            const random = randomBytes(byteLength)
            randomInt = parseInt(random.toString("hex"), 16)
        } while (randomInt >= range)

        return randomInt + min
    }

    async getDatesInBatch(
        batchSize: number
    ): Promise<{ msg: string; code: number }> {
        const total = await this.inventoryRepo.count()
        const totalBatch = Math.ceil(total / batchSize)

        for (let batchNumber = 1; batchNumber <= totalBatch; batchNumber++) {
            const skip = (batchNumber - 1) * batchSize
            const maskNumber = this.getSecureRandomInt()
            // console.log("NUMber ", maskNumber)
            const batch = await this.inventoryRepo.find({
                skip,
                take: batchSize,
                select: ["id", "dateOfExpiry", "dateOfDisbursement"],
                order: { id: "ASC" },
            })

            const dateObjs = batch
                .filter(i => i.dateOfDisbursement && i.dateOfExpiry)
                .map(item => ({
                    expiryDate: this.toUnix(item.dateOfExpiry, maskNumber),
                    disbursedDate: this.toUnix(
                        item.dateOfDisbursement,
                        maskNumber
                    ),
                }))
            // console.log("data => ",dateObjs);
            try {
                const contract = this.task2ContractService.getContract()
                console.log(`Validation passed for batch no ${batchNumber}`);
                await contract.validate(dateObjs)
            } catch (err) {
                // console.log("Task 2 service error => ", err)
                console.log(`Validation failed for batch no ${batchNumber}`);

                return {
                    msg: `Validation failed for batch no ${batchNumber}!`,
                    code: 400,
                }
            }
        }
        return { msg: "Validation passed.", code: 200 }
    }
}
