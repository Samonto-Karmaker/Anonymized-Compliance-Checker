import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Task3ContractService } from "src/contracts/task3/task3.contract.service"
import { BatchInfo } from "src/db/batchInfo.entity"
import { Inventory } from "src/db/inventory.entity"
import { In, Repository } from "typeorm"
import { HashService } from "../task3-hash/hash.service"
import { Contract, ContractTransactionResponse } from "ethers"

@Injectable()
export class BatchService {
    constructor(
        @InjectRepository(BatchInfo)
        private readonly batchInfoRepository: Repository<BatchInfo>,
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        private readonly task3ContractService: Task3ContractService,
        private readonly hashService: HashService
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
            .orderBy("inventory.id", "ASC")
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
            .orderBy("inventory.id", "ASC")
            .getMany()
    }

    prepareDataForCreationHash(inventories: Inventory[]): string {
        return inventories
            .map(inventory => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { dateOfDisbursement, ...rest } = inventory
                return Object.values(rest)
                    .map(value =>
                        value instanceof Date
                            ? value.toISOString()
                            : value.toString()
                    )
                    .join("|")
            })
            .join("||")
    }

    prepareDataForUpdateHash(inventories: Inventory[]): string {
        return inventories
            .map(inventory => {
                const { dateOfDisbursement } = inventory
                return dateOfDisbursement
                    ? new Date(dateOfDisbursement).toISOString()
                    : "null"
            })
            .join("||")
    }

    async generateInitialHash(
        data: string,
        type: "creation" | "update"
    ): Promise<{
        contract: Contract
        hash: string
        batchId: number
    }> {
        const contract = this.task3ContractService.getContract()
        const prevHash = await this.getPreviousHash(contract, type)
        const nextBatchId = await this.getNextBatchId(type)

        const hash = await this.hashService.hashString(
            data,
            prevHash,
            nextBatchId
        )
        return { contract, hash, batchId: nextBatchId }
    }

    async sendCreationBatch(): Promise<void> {
        const untracked = await this.getUntrackedInventories()
        const minSize = Number(process.env.MIN_BATCH_SIZE) || 5

        if (untracked.length <= minSize) {
            console.log("Not enough untracked inventories for batch.")
            return
        }

        const data = this.prepareDataForCreationHash(untracked)
        const { hash, batchId } = await this.generateInitialHash(
            data,
            "creation"
        )
        const contract = this.task3ContractService.getContract()

        try {
            const tx = (await contract.create(
                batchId,
                hash
            )) as ContractTransactionResponse
            await tx.wait()

            console.log("Blockchain tx successful", {
                hash: tx.hash,
                batchId,
                inventories: untracked.length,
            })
            await this.batchInfoRepository.save(
                untracked.map(inventory => {
                    const batchInfo = new BatchInfo()
                    batchInfo.inventoryId = inventory.id
                    batchInfo.creationBatchId = batchId
                    return batchInfo
                })
            )
        } catch (error: unknown) {
            console.error("Blockchain tx failed", {
                error,
                hash,
                batchId,
                inventories: untracked.length,
            })
            throw new Error("Failed to send creation batch")
        }
    }

    async sendUpdateBatch(): Promise<void> {
        const inventories = await this.getInventoriesReadyForUpdateTracking()
        const minSize = Number(process.env.MIN_BATCH_SIZE) || 5

        if (inventories.length <= minSize) {
            console.log("Not enough inventories for update batch.")
            return
        }

        const data = this.prepareDataForUpdateHash(inventories)
        const { hash, batchId } = await this.generateInitialHash(data, "update")
        const contract = this.task3ContractService.getContract()

        try {
            const tx = (await contract.update(
                batchId,
                hash
            )) as ContractTransactionResponse
            await tx.wait()

            console.log("Blockchain tx successful", {
                hash: tx.hash,
                batchId,
                inventories: inventories.length,
            })
            await this.batchInfoRepository.save(
                inventories.map(inventory => {
                    const batchInfo = new BatchInfo()
                    batchInfo.inventoryId = inventory.id
                    batchInfo.updateBatchId = batchId
                    return batchInfo
                })
            )
        } catch (error: unknown) {
            console.error("Blockchain tx failed", {
                error,
                hash,
                batchId,
                inventories: inventories.length,
            })
            throw new Error("Failed to send update batch")
        }
    }

    // Helper methods
    private async getPreviousHash(
        contract: Contract,
        type: "creation" | "update",
        isLatest: boolean = true
    ): Promise<string> {
        if (!isLatest) {
            // TODO: Implement logic to get a specific previous hash if needed
            throw new Error("Previous hash retrieval not implemented")
        }
        if (type === "creation") {
            return String(await contract.latestCreationHash())
        }
        return String(await contract.latestUpdateHash())
    }

    private async getNextBatchId(type: "creation" | "update"): Promise<number> {
        const column = type === "creation" ? "creationBatchId" : "updateBatchId"

        const result = await this.batchInfoRepository
            .createQueryBuilder("batchInfo")
            .select(`MAX(batchInfo.${column})`, "max")
            .getRawOne<{ max: number }>()

        return (result?.max ?? 0) + 1
    }

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
            order: { id: "ASC" },
        })

        if (!inventories.length) {
            throw new NotFoundException(
                `No inventories found for ${batchField} ${id}`
            )
        }

        return inventories
    }
}
