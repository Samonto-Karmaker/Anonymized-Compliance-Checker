import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { Inventory } from "./inventory.entity"

@Entity()
export class BatchInfo {
    @PrimaryColumn()
    inventoryId: number

    @OneToOne(() => Inventory, inventory => inventory.id)
    @JoinColumn({ name: "inventoryId", referencedColumnName: "id" })
    inventory: Inventory

    @Column({ nullable: true })
    creationBatchId: number

    @Column({ nullable: true })
    updateBatchId: number
}
