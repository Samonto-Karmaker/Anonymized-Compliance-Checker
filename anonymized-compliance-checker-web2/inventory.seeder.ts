import { DataSource } from "typeorm"
import { faker } from "@faker-js/faker"
import * as dotenv from "dotenv"
import { Inventory } from "./src/db/inventory.entity"
dotenv.config()

async function seed() {
    const dataSource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "inventory_db",
        entities: [Inventory],
        synchronize: true,
    })

    await dataSource.initialize()

    const repo = dataSource.getRepository(Inventory)

    for (let i = 0; i < 100; i++) {
        const item = repo.create({
            productId: faker.string.uuid(),
            productName: faker.commerce.productName(),
            quantity: faker.number.int({ min: 1, max: 100 }),
            price: parseFloat(faker.commerce.price()),
            dateOfExpiry: faker.date.future(),
            dateOfProcurement: faker.date.past(),
            dateOfDisbursement:
                Math.random() > 0.5 ? faker.date.recent() : null,
            vendorName: faker.company.name(),
        })

        await repo.save(item)
    }

    await dataSource.destroy()
    console.log("Seeding complete!")
}

seed().catch(console.error)
