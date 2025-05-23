import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,
} from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { BatchInfo } from "src/db/batchInfo.entity"
import { CreateInventoryDto } from "src/dto/create-inventory"
import { CronJob } from "cron"
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule"

@Injectable()
export class Task3Service implements OnModuleInit {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
        @InjectRepository(BatchInfo)
        private readonly batchInfoRepository: Repository<BatchInfo>,
        private schedulerRegistry: SchedulerRegistry
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
    async updateDisbursementDate(
        inventoryId: number,
        date: Date
    ): Promise<Inventory> {
        if (!date) {
            throw new BadRequestException("Date is required")
        }
        try {
            const inventory = await this.inventoryRepository.findOne({
                where: { id: inventoryId },
                select: ["id", "dateOfDisbursement", "dateOfProcurement"],
            })
            if (!inventory) {
                throw new NotFoundException(
                    `Inventory with ID ${inventoryId} not found`
                )
            }
            if (inventory.dateOfDisbursement) {
                throw new BadRequestException(
                    `Inventory with ID ${inventoryId} already has a disbursement date`
                )
            }
            if (date < inventory.dateOfProcurement) {
                throw new BadRequestException(
                    `Disbursement date cannot be earlier than procurement date`
                )
            }

            inventory.dateOfDisbursement = date
            const updatedInventory =
                await this.inventoryRepository.save(inventory)

            return updatedInventory
        } catch (error) {
            console.error("Error updating disbursement date:", error)
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error
            }
            throw new InternalServerErrorException(
                "Error updating disbursement date. Please try again later."
            )
        }
    }

    //=== Cron Job Setup ===
    // This method is called when the module is initialized
    onModuleInit() {
        const isProd = process.env.NODE_ENV === "production"
        const cronTime = isProd
            ? CronExpression.EVERY_30_SECONDS
            : CronExpression.EVERY_10_SECONDS
        this.addCronJob("sync-db-with-contact", cronTime)

        if (!isProd) {
            console.log(`Cron job is running in development mode`)
            this.handleCron()
        }
    }

    // This method is used to register a cron job
    private addCronJob(name: string, cronTime: string) {
        const job = new CronJob(cronTime, () => {
            this.handleCron()
        })
        this.schedulerRegistry.addCronJob(name, job)
        job.start()
        console.log(`Cron job ${name} started with time: ${cronTime}`)
    }

    // This method is called when the cron job is triggered
    private handleCron() {
        console.log(`Cron job running at ${new Date().toISOString()}`)
    }
}
