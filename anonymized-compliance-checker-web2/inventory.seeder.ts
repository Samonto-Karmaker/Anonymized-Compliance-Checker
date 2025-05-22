import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Inventory } from './src/db/inventory.entity';

dotenv.config();

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

  await dataSource.initialize();
  const repo = dataSource.getRepository(Inventory);

  const rawData = fs.readFileSync('seedData.json', 'utf-8');
  const data = JSON.parse(rawData);

  for (const itemData of data) {
    const item = repo.create({
      productId: itemData.productId,
      productName: itemData.productName,
      quantity: itemData.quantity,
      price: itemData.price,
      dateOfExpiry: new Date(itemData.dateOfExpiry),
      dateOfProcurement: new Date(itemData.dateOfProcurement),
      dateOfDisbursement: new Date(itemData.dateOfDisbursement),
      vendorName: itemData.vendorName,
    });
    await repo.save(item);
  }

  await dataSource.destroy();
  console.log('Seeding complete from JSON!');
}

seed().catch(console.error)
