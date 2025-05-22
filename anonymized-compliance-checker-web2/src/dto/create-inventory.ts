export class CreateInventoryDto {
    productId: string
    productName: string
    quantity: number
    price: number
    dateOfExpiry: Date
    dateOfProcurement: Date
    dateOfDisbursement?: Date | null
    vendorName: string
}
