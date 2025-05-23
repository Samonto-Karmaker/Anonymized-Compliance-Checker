import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Inventory } from "src/db/inventory.entity"
import { CreateInventoryDto } from "src/dto/create-inventory"

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Inventory)
        private readonly inventoryRepository: Repository<Inventory>,
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
}
