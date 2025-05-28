import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Task3ContractService } from "src/contracts/task3/task3.contract.service"
import { BatchInfo } from "src/db/batchInfo.entity"
import { Inventory } from "src/db/inventory.entity"
import { In, Repository } from "typeorm"
import { HashService } from "../task3-hash/hash.service"
import { Contract, ContractTransactionResponse } from "ethers"
import { Task3Response } from "src/dto/task3-response"

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

    async generateCreationHashForVerification(
        batchId: number
    ): Promise<string> {
        const inventories = await this.getInventoryByCreationBatchId(batchId)
        const data = this.prepareDataForCreationHash(inventories)
        const contract = this.task3ContractService.getContract()
        const prevHash = await this.getPreviousHash(
            contract,
            "creation",
            false,
            batchId - 1
        )
        const hash = await this.hashService.hashString(data, prevHash, batchId)
        return hash
    }

    async generateUpdateHashForVerification(batchId: number): Promise<string> {
        const inventories = await this.getInventoryByUpdateBatchId(batchId)
        const data = this.prepareDataForUpdateHash(inventories)
        const contract = this.task3ContractService.getContract()
        const prevHash = await this.getPreviousHash(
            contract,
            "update",
            false,
            batchId - 1
        )
        const hash = await this.hashService.hashString(data, prevHash, batchId)
        return hash
    }

    async verifyCreationHashByInventoryId(
        inventoryId: number
    ): Promise<boolean> {
        const batchInfo = await this.getBatchInfoByInventoryId(inventoryId)
        if (!batchInfo.creationBatchId) {
            throw new NotFoundException(
                `No creation batch found for inventory ID ${inventoryId}`
            )
        }
        const hash = await this.generateCreationHashForVerification(
            batchInfo.creationBatchId
        )
        return (
            hash ===
            (
                await this.hashService.getCreationHashByInternalId(
                    batchInfo.creationBatchId
                )
            ).hash
        )
    }

    async verifyUpdateHashByInventoryId(inventoryId: number): Promise<boolean> {
        const batchInfo = await this.getBatchInfoByInventoryId(inventoryId)
        if (!batchInfo.updateBatchId) {
            throw new NotFoundException(
                `No update batch found for inventory ID ${inventoryId}`
            )
        }
        const hash = await this.generateUpdateHashForVerification(
            batchInfo.updateBatchId
        )
        return (
            hash ===
            (
                await this.hashService.getUpdateHashByInternalId(
                    batchInfo.updateBatchId
                )
            ).hash
        )
    }

    async verifyAll(): Promise<Task3Response> {
        const untrackedInventories = (await this.getUntrackedInventories())
            .length
        const inventoriesReadyForUpdate = (
            await this.getInventoriesReadyForUpdateTracking()
        ).length

        const creationBatchesVerified = await this.verifyCreationBatches()
        const updateBatchesVerified = await this.verifyUpdateBatches()

        return new Task3Response(
            untrackedInventories,
            inventoriesReadyForUpdate,
            creationBatchesVerified,
            updateBatchesVerified
        )
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
    private async verifyCreationBatches(): Promise<boolean> {
        const totalCreationBatches = await this.batchInfoRepository
            .createQueryBuilder("batchInfo")
            .select("COUNT(DISTINCT batchInfo.creationBatchId)", "count")
            .getRawOne<{ count: number }>()
        if (!totalCreationBatches?.count) {
            console.log("No creation batches found for verification.")
            return true
        }
        for (let i = 1; i <= totalCreationBatches.count; i++) {
            try {
                const hash = await this.generateCreationHashForVerification(i)
                const storedHash = (
                    await this.hashService.getCreationHashByInternalId(i)
                ).hash
                if (hash !== storedHash) {
                    console.error(
                        `Creation batch ${i} hash mismatch: expected ${storedHash}, got ${hash}`
                    )
                    return false
                }
            } catch (error) {
                console.error(`Creation batch ${i} verification failed`, error)
            }
        }
        return true
    }
    private async verifyUpdateBatches(): Promise<boolean> {
        const totalUpdateBatches = await this.batchInfoRepository
            .createQueryBuilder("batchInfo")
            .select("COUNT(DISTINCT batchInfo.updateBatchId)", "count")
            .getRawOne<{ count: number }>()
        if (!totalUpdateBatches?.count) {
            console.log("No update batches found for verification.")
            return true
        }
        for (let i = 1; i <= totalUpdateBatches.count; i++) {
            try {
                const hash = await this.generateUpdateHashForVerification(i)
                const storedHash = (
                    await this.hashService.getUpdateHashByInternalId(i)
                ).hash
                if (hash !== storedHash) {
                    console.error(
                        `Update batch ${i} hash mismatch: expected ${storedHash}, got ${hash}`
                    )
                    return false
                }
            } catch (error) {
                console.error(`Update batch ${i} verification failed`, error)
            }
        }
        return true
    }

    private async getPreviousHash(
        contract: Contract,
        type: "creation" | "update",
        isLatest: boolean = true,
        id?: number
    ): Promise<string> {
        if (!isLatest) {
            const batchId = id ?? (await this.getNextBatchId(type)) - 1
            if (batchId < 1) {
                return ""
            }
            if (type === "creation") {
                return (
                    (
                        await this.hashService.getCreationHashByInternalId(
                            batchId
                        )
                    ).hash || ""
                )
            }
            return (
                (await this.hashService.getUpdateHashByInternalId(batchId))
                    .hash || ""
            )
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
