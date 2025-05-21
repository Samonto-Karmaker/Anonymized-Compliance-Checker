import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    productId: string

    @Column()
    productName: string

    @Column("int")
    quantity: number

    @Column("decimal")
    price: number

    @Column({ type: "date" })
    dateOfExpiry: Date

    @Column({ type: "date" })
    dateOfProcurement: Date

    @Column({ type: "date", nullable: true })
    dateOfDisbursement: Date | null

    @Column()
    vendorName: string
}
